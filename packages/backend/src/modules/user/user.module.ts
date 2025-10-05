import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserService } from './commands/create_user/create-user.service';

export class UserModule {
  public readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/user');
    container.register(CreateUserService, { useClass: CreateUserService });
  }
}
