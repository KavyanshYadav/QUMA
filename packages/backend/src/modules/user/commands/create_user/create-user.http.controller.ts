import { injectable, inject } from 'tsyringe';
import { MemoryBus } from '../../../../libs/utils/commandbus/MemoryBus';
import { Request, Response } from 'express';
// import {} from '@quma_types';
@injectable()
export class CrateUserHttpController {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {}

  async handle(req: Request, res: Response) {
    // const para =  CreateUserRequestSchema.parse(req.body);
    console.log(this.memoryBus);
  }
}
