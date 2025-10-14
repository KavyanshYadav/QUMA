import { describe, it, expect } from 'vitest';
import { UserEntity } from './user.entity.js';
import { UserRoles } from './user.types';
import { UserCreatedDomainEvent } from './events/user-created-event.js';
import { runInTestContext } from '../../../test-utils.js';

describe('UserEntity', () => {
  describe('create', () => {
    it('should create a user entity with provided email', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';

        // Act
        const user = UserEntity.create({ email });

        // Assert
        expect(user).toBeInstanceOf(UserEntity);
        expect(user.getProps().email).toBe(email);
      });
    });

    it('should generate UUID if id is not provided', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';

        // Act
        const user = UserEntity.create({ email });

        // Assert
        expect(user.id).toBeDefined();
        expect(typeof user.id).toBe('string');
        expect(user.id.length).toBeGreaterThan(0);
      });
    });

    it('should use provided id if given', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';
        const providedId = 'custom-id-123';

        // Act
        const user = UserEntity.create({ id: providedId, email });

        // Assert
        expect(user.id).toBe(providedId);
      });
    });

    it('should set default role to guest', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';

        // Act
        const user = UserEntity.create({ email });

        // Assert
        expect(user.getProps().role).toBe(UserRoles.guest);
      });
    });

    it('should emit UserCreatedDomainEvent', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';

        // Act
        const user = UserEntity.create({ email });

        // Assert
        const events = user.domainEvents;
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UserCreatedDomainEvent);

        const event = events[0] as UserCreatedDomainEvent;
        expect(event.email).toBe(email);
        expect(event.aggregateId).toBe(user.id);
      });
    });

    it('should emit UserCreatedDomainEvent with empty address fields', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';

        // Act
        const user = UserEntity.create({ email });

        // Assert
        const events = user.domainEvents;
        const event = events[0] as UserCreatedDomainEvent;
        expect(event.country).toBe('');
        expect(event.postalCode).toBe('');
        expect(event.street).toBe('');
      });
    });
  });

  describe('role getter', () => {
    it('should return the user role', () => {
      runInTestContext(() => {
        // Arrange
        const email = 'test@example.com';
        const user = UserEntity.create({ email });

        // Act
        const role = user.role;

        // Assert
        expect(role).toBe(UserRoles.guest);
      });
    });
  });
});
