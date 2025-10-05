export abstract class UserRepositoryPort {
  abstract isEmailTaken(email: string): Promise<boolean>;
  abstract createUser(user: {
    email: string;
    country: string;
    postalCode: string;
    street: string;
  }): Promise<void>;
}
