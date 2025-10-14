/* eslint-disable @nx/enforce-module-boundaries */
import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { CreateUserCommand } from './create-user.command.js';
import { UserRequestDto } from '@quma/types';
import { Logger } from '@quma/ddd';
import { MemoryBus } from '@quma/ddd';

@injectable()
export class CrateUserHttpController {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {}

  async handle(req: Request, res: Response) {
    // const para =  CreateUserRequestSchema.parse(req.body);
    const para: UserRequestDto = req.body;
    Logger.info(JSON.stringify(para));
    //const para = req.body;
    await this.memoryBus.execute(
      new CreateUserCommand({
        email: 'user@example.com',
        country: 'USA',
        postalCode: '12345',
        street: '123 Main St',
      })
    );

    res.send({ message: 'User created' });
  }
}
