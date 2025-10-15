import { injectable, inject } from 'tsyringe';
import { MemoryBus, BaseController } from '@quma/ddd';
import { CreateAuthWithEmailCommand } from '../auth.createWithEmail.js';

const key = 'AUTH_MODULE.CREATE_WITH_EMAIL';

@injectable()
export class CreateAuthHttpController extends BaseController<typeof key> {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {
    super();
  }

  protected override getRouterKey(): 'AUTH_MODULE.CREATE_WITH_EMAIL' {
    return key;
  }

  protected override async execute(req: {
    params: unknown;
    query: unknown;
    body: { email: string };
  }): Promise<{ statusCode: 200 | 201; data: { message: string } }> {
    {
      // const para =  CreateUserRequestSchema.parse(req.body);
      console.log(req);
      //const para = req.body;
      await this.memoryBus.execute(
        new CreateAuthWithEmailCommand({
          email: 'asdas@email.com',
          profile: 'Asds',
        })
      );

      return {
        statusCode: 200,
        data: {
          message: 'auth created',
        },
      };
    }
  }
}
