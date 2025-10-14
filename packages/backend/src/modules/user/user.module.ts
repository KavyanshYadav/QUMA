import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserService } from './commands/create_user/create-user.service.js';
import { CrateUserHttpController } from './commands/create_user/create-user.http.controller.js';
import { MemoryBus } from '@quma/ddd';
import { CreateUserCommand } from './commands/create_user/create-user.command.js';
import { UserPostGresRepo } from './database/user.postgres.repository.js';
export class UserModule {
  public readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/user');
    container.register(UserPostGresRepo, { useClass: UserPostGresRepo });
    container.register(CreateUserService, { useClass: CreateUserService });
    container.register(CrateUserHttpController, {
      useClass: CrateUserHttpController,
    });
    const memoryBus = container.resolve(MemoryBus);
    const createUserService = container.resolve(CreateUserService);
    memoryBus.registerHandler(CreateUserCommand, createUserService);
    this.router.post('/user', async (req, res) => {
      const controller = container.resolve(CrateUserHttpController);
      await controller.handle(req, res);
    });
  }
}
