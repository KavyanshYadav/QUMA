import { Router } from 'express';
import { MemoryBus } from '@quma/quma_ddd_base';
import { container } from 'tsyringe';
import { AuthPostGresRepo } from './database/prostgres.auth.repo';
import { CreateAuthWithEmailCommand } from './commands/auth.createWithEmail';
import { CreateAuthHttpController } from './commands/create/auth.create.http.controller';
import { CreateWithEmailService } from './commands/create/services/createWithEmailService';

export class AuthMoudle {
  public router: Router;
  constructor() {
    this.router = Router();

    container.register(AuthPostGresRepo, { useClass: AuthPostGresRepo });
    container.register(CreateWithEmailService, {
      useClass: CreateWithEmailService,
    });
    container.register(CreateAuthHttpController, {
      useClass: CreateAuthHttpController,
    });

    const memoryBus = container.resolve(MemoryBus);
    memoryBus.registerHandler(
      CreateAuthWithEmailCommand,
      container.resolve(CreateWithEmailService)
    );

    this.router.post('/auth/email', async (req, res) => {
      const controller = container.resolve(CreateAuthHttpController);
      controller.handle(req, res);
    });
  }
}
