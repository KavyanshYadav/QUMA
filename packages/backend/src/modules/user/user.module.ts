import { Router } from 'express';
import { container } from 'tsyringe';
import { CreateUserService } from './commands/create_user/create-user.service';
import { CrateUserHttpController } from './commands/create_user/create-user.http.controller';
import { MemoryBus } from '@quma/quma_ddd_base';
import { CreateUserCommand } from './commands/create_user/create-user.command';
export class UserModule {
  public readonly router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/user');
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
