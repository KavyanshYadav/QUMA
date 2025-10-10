/* eslint-disable @nx/enforce-module-boundaries */
import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { UserRequestDto } from '@quma/quma_types';
import { Logger } from '@quma/quma_ddd_base';
import { MemoryBus } from '@quma/quma_ddd_base';
import { CreateAuthWithEmailCommand } from '../auth.createWithEmail';
@injectable()
export class CreateAuthHttpController {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {}

  async handle(req: Request, res: Response) {
    // const para =  CreateUserRequestSchema.parse(req.body);

    const para: UserRequestDto = req.body;
    Logger.info(JSON.stringify(para));
    //const para = req.body;
    await this.memoryBus.execute(
      new CreateAuthWithEmailCommand({
        email: 'user@example.com',
      })
    );

    res.send({ message: 'Auth created' });
  }
}
