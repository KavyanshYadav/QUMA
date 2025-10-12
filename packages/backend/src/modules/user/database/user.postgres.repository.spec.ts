import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserPostGresRepo } from './user.postgres.repository';
import { UserEntity } from '../domain/user.entity';
import { runInTestContext } from '../../../test-utils';

// Mock the database module
vi.mock('../../../db/index', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
  },
}));

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
  eq: vi.fn((field, value) => ({ field, value, type: 'eq' })),
}));

// Mock the schema
vi.mock('./schema', () => ({
  users: {
    id: 'id',
    email: 'email',
    display_name: 'display_name',
  },
}));

describe('UserPostGresRepo', () => {
  let userPostGresRepo: UserPostGresRepo;
  let mockDb: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Get the mocked db
    const { db } = require('../../../db/index');
    mockDb = db;

    // Create repository instance
    userPostGresRepo = new UserPostGresRepo();
  });

  describe('createUser', () => {
    it('should create a user and return UserEntity', async () => {
      return runInTestContext(async () => {
        // Arrange
        const userData = {
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        };

        const mockInsertResult = [{ id: 'generated-uuid-123' }];

        const mockInsert = vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
              execute: vi.fn().mockResolvedValue(mockInsertResult),
            }),
          }),
        });

        mockDb.insert.mockReturnValue(mockInsert());

        // Act
        const result = await userPostGresRepo.createUser(userData);

        // Assert
        expect(result).toBeInstanceOf(UserEntity);
        expect(result.getProps().email).toBe(userData.email);
        expect(result.id).toBe('generated-uuid-123');
        expect(mockDb.insert).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle database errors during user creation', async () => {
      return runInTestContext(async () => {
        // Arrange
        const userData = {
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        };

        const mockInsert = vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockReturnValue({
              execute: vi.fn().mockRejectedValue(new Error('Database error')),
            }),
          }),
        });

        mockDb.insert.mockReturnValue(mockInsert());

        // Act & Assert
        await expect(userPostGresRepo.createUser(userData)).rejects.toThrow(
          'Database error'
        );
      });
    });
  });

  describe('findUserByEmail', () => {
    it('should find and return user by email', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'test@example.com';
        const mockUserData = [{ id: 'user-123', email }];

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue(mockUserData),
            }),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act
        const result = await userPostGresRepo.findUserByEmail(email);

        // Assert
        expect(result).toBeInstanceOf(UserEntity);
        expect(result?.getProps().email).toBe(email);
        expect(result?.id).toBe('user-123');
        expect(mockDb.select).toHaveBeenCalledTimes(1);
      });
    });

    it('should return undefined when user is not found', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'nonexistent@example.com';
        const mockUserData: any[] = [];

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue(mockUserData),
            }),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act
        const result = await userPostGresRepo.findUserByEmail(email);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    it('should handle database errors during find', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'test@example.com';

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi
                .fn()
                .mockRejectedValue(new Error('Database connection failed')),
            }),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act & Assert
        await expect(userPostGresRepo.findUserByEmail(email)).rejects.toThrow(
          'Database connection failed'
        );
      });
    });
  });

  describe('isEmailTaken', () => {
    it('should return user entity when email is taken', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'taken@example.com';
        const mockUserData = [{ id: 'user-123', email }];

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockUserData),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act
        const result = await userPostGresRepo.isEmailTaken(email);

        // Assert
        expect(result).toBeInstanceOf(UserEntity);
        expect(result?.getProps().email).toBe(email);
        expect(result?.id).toBe('user-123');
      });
    });

    it('should return undefined when email is not taken', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'available@example.com';
        const mockUserData: any[] = [];

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockUserData),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act
        const result = await userPostGresRepo.isEmailTaken(email);

        // Assert
        expect(result).toBeUndefined();
      });
    });

    it('should handle database errors during email check', async () => {
      return runInTestContext(async () => {
        // Arrange
        const email = 'test@example.com';

        const mockSelect = vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockRejectedValue(new Error('Database timeout')),
          }),
        });

        mockDb.select.mockReturnValue(mockSelect());

        // Act & Assert
        await expect(userPostGresRepo.isEmailTaken(email)).rejects.toThrow(
          'Database timeout'
        );
      });
    });
  });
});
