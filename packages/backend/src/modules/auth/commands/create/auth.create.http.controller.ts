import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { AuthEmailRequestDTO } from '@quma/types';
import { Logger } from '@quma/ddd';
import { MemoryBus } from '@quma/ddd';
import { CreateAuthWithEmailCommand } from '../auth.createWithEmail.js';
@injectable()
export class CreateAuthHttpController {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {}

  async handle(req: Request, res: Response) {
    // const para =  CreateUserRequestSchema.parse(req.body);
    const para = AuthEmailRequestDTO.parse(req.body);
    Logger.info(JSON.stringify(para));
    //const para = req.body;
    await this.memoryBus.execute(
      new CreateAuthWithEmailCommand({
        email: para.email,
        profile: para.profile,
      })
    );

    res.send({ message: 'Auth created' });
  }
}
