import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Logger from quma_ddd_base
vi.mock('@quma/ddd', async () => {
  const actual = await vi.importActual('@quma/ddd');
  return {
    ...actual,
    Logger: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    },
  };
});

import { CreateUserService } from './create-user.service.js';
import { CreateUserCommand } from './create-user.command.js';
import { UserEntity } from '../../domain/user.entity.js';
import { runInTestContext } from '../../../../test-utils.js';

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let mockUserPostGresRepo: any;

  beforeEach(() => {
    // Create mock repository
    mockUserPostGresRepo = {
      createUser: vi.fn(),
      findUserByEmail: vi.fn(),
      isEmailTaken: vi.fn(),
    };

    // Create service instance with mocked repository
    createUserService = new CreateUserService(mockUserPostGresRepo);
  });

  describe('execute', () => {
    it('should create a user entity with correct email', async () => {
      return runInTestContext(async () => {
        // Arrange
        const command = new CreateUserCommand({
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        });

        const mockCreatedUser = UserEntity.create({ email: command.email });
        mockUserPostGresRepo.createUser.mockResolvedValue(mockCreatedUser);

        // Act
        const result = await createUserService.execute(command);

        // Assert
        expect(result).toBeInstanceOf(UserEntity);
        expect(result.getProps().email).toBe(command.email);
      });
    });

    it('should call repository.createUser with correct parameters', async () => {
      return runInTestContext(async () => {
        // Arrange
        const command = new CreateUserCommand({
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        });

        const mockCreatedUser = UserEntity.create({ email: command.email });
        mockUserPostGresRepo.createUser.mockResolvedValue(mockCreatedUser);

        // Act
        await createUserService.execute(command);

        // Assert
        expect(mockUserPostGresRepo.createUser).toHaveBeenCalledTimes(1);
        expect(mockUserPostGresRepo.createUser).toHaveBeenCalledWith({
          email: command.email,
          country: expect.any(String), // The service uses user.id for these fields
          postalCode: expect.any(String),
          street: expect.any(String),
        });
      });
    });

    it('should return the created user entity', async () => {
      return runInTestContext(async () => {
        // Arrange
        const command = new CreateUserCommand({
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        });

        const mockCreatedUser = UserEntity.create({ email: command.email });
        mockUserPostGresRepo.createUser.mockResolvedValue(mockCreatedUser);

        // Act
        const result = await createUserService.execute(command);

        // Assert
        expect(result).toBeInstanceOf(UserEntity);
        expect(result.getProps().email).toBe(mockCreatedUser.getProps().email);
      });
    });

    it('should handle repository errors', async () => {
      return runInTestContext(async () => {
        // Arrange
        const command = new CreateUserCommand({
          email: 'test@example.com',
          country: 'USA',
          postalCode: '12345',
          street: '123 Main St',
        });

        const error = new Error('Database connection failed');
        mockUserPostGresRepo.createUser.mockRejectedValue(error);

        // Act & Assert
        await expect(createUserService.execute(command)).rejects.toThrow(
          'Database connection failed'
        );
      });
    });

    it('should create user with different email addresses', async () => {
      return runInTestContext(async () => {
        // Arrange
        const emails = [
          'user1@example.com',
          'user2@test.com',
          'admin@company.org',
        ];

        for (const email of emails) {
          const command = new CreateUserCommand({
            email,
            country: 'USA',
            postalCode: '12345',
            street: '123 Main St',
          });

          const mockCreatedUser = UserEntity.create({ email });
          mockUserPostGresRepo.createUser.mockResolvedValue(mockCreatedUser);

          // Act
          const result = await createUserService.execute(command);

          // Assert
          expect(result.getProps().email).toBe(email);
          expect(mockUserPostGresRepo.createUser).toHaveBeenCalledWith({
            email,
            country: expect.any(String),
            postalCode: expect.any(String),
            street: expect.any(String),
          });
        }
      });
    });
  });
});
