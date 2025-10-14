import { describe, it, expect } from 'vitest';
import { IdentityEntity } from './auth.identity.entity.js';
import { ProviderName } from './auth.value.objects.js';
import { runInTestContext } from '../../../test-utils.js';

describe('IdentityEntity', () => {
  describe('create', () => {
    it('should create an identity entity with provided props', () => {
      runInTestContext(() => {
        // Arrange
        const props = {
          provider: 'google' as ProviderName,
          providerId: 'google-123',
          userId: 'user-456',
          email: 'test@example.com',
          profile: { name: 'Test User' },
        };

        // Act
        const identity = IdentityEntity.create(props);

        // Assert
        expect(identity).toBeInstanceOf(IdentityEntity);
        expect(identity.getProps().provider).toBe(props.provider);
        expect(identity.getProps().providerId).toBe(props.providerId);
        expect(identity.getProps().userId).toBe(props.userId);
        expect(identity.getProps().email).toBe(props.email);
        expect(identity.getProps().profile).toEqual(props.profile);
      });
    });

    it('should generate UUID automatically for id', () => {
      runInTestContext(() => {
        // Arrange
        const props = {
          provider: 'github' as ProviderName,
          providerId: 'github-789',
          userId: null,
          email: 'github@example.com',
        };

        // Act
        const identity = IdentityEntity.create(props);

        // Assert
        expect(identity.getProps().id).toBeDefined();
        expect(typeof identity.getProps().id).toBe('string');
        expect(identity.getProps().id.length).toBeGreaterThan(0);
      });
    });

    it('should create identity with minimal required props', () => {
      runInTestContext(() => {
        // Arrange
        const props = {
          provider: 'Email' as ProviderName,
          providerId: 'email-123',
          userId: 'user-456',
        };

        // Act
        const identity = IdentityEntity.create(props);

        // Assert
        expect(identity).toBeInstanceOf(IdentityEntity);
        expect(identity.getProps().provider).toBe(props.provider);
        expect(identity.getProps().providerId).toBe(props.providerId);
        expect(identity.getProps().userId).toBe(props.userId);
        expect(identity.getProps().email).toBeUndefined();
        expect(identity.getProps().profile).toBeUndefined();
      });
    });

    it('should create identity with null userId', () => {
      runInTestContext(() => {
        // Arrange
        const props = {
          provider: 'Phone' as ProviderName,
          providerId: 'phone-123',
          userId: null,
          email: 'phone@example.com',
        };

        // Act
        const identity = IdentityEntity.create(props);

        // Assert
        expect(identity).toBeInstanceOf(IdentityEntity);
        expect(identity.getProps().userId).toBeNull();
      });
    });

    it('should create identity with different provider types', () => {
      runInTestContext(() => {
        // Arrange
        const providers: ProviderName[] = [
          'google',
          'github',
          'X',
          'unknown',
          'Email',
          'Phone',
        ];

        providers.forEach((provider) => {
          // Act
          const identity = IdentityEntity.create({
            provider,
            providerId: `${provider}-123`,
            userId: 'user-456',
          });

          // Assert
          expect(identity).toBeInstanceOf(IdentityEntity);
          expect(identity.getProps().provider).toBe(provider);
        });
      });
    });
  });
});
