import { injectable, inject } from 'tsyringe';
import { MemoryBus, BaseController } from '@quma/ddd';
import { CreateAuthWithEmailCommand } from '../auth.createWithEmail.js';

const key = 'AUTH_MODULE.CREATE_WITH_OAUTH';

@injectable()
export class CreateAuthHttpController extends BaseController<typeof key> {
  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {
    super();
  }

  protected override getRouterKey(): 'AUTH_MODULE.CREATE_WITH_OAUTH' {
    return key;
  }

  protected override async execute(req: {
    params: unknown;
    query: unknown;
    body: { email: string; providerKEY: number };
  }): Promise<{
    statusCode: 200 | 201;
    data: { email: string; providerKEY: number };
  }> {
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
        statusCode: 201,
        data: {
          email: 'dsd',
          providerKEY: 123213,
        },
      };
    }
  }
}
