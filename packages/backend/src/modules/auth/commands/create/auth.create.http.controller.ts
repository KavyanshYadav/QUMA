/* eslint-disable @nx/enforce-module-boundaries */
import { injectable, inject } from 'tsyringe';
import {
  MemoryBus,
  BaseController,
  ControllerRequest,
  ControllerResponse,
  Logger,
  RequestContext,
} from '@quma/ddd';
import { CreateAuthWithEmailCommand } from '../auth.createWithEmail.js';
import { AppRouter } from '@quma/config';

@injectable()
export class CreateAuthHttpController extends BaseController<
  typeof AppRouter.AUTH_MODULE.CREATE_WITH_EMAIL
> {
  static override ROUTE = AppRouter.AUTH_MODULE.CREATE_WITH_EMAIL;

  constructor(@inject(MemoryBus) private readonly memoryBus: MemoryBus) {
    super();
  }
  protected override async execute(
    req: ControllerRequest<typeof CreateAuthHttpController.ROUTE.key>
  ): Promise<ControllerResponse<typeof CreateAuthHttpController.ROUTE.key>> {
    // const para =  CreateUserRequestSchema.parse(req.body);

    //const para = req.body;

    Logger.info('sad', RequestContext.getContext());
    await this.memoryBus.execute(
      new CreateAuthWithEmailCommand({
        email: 'asdas@email.com',
        profile: 'Asds',
      })
    );
    return {
      statusCode: 201,
      data: {
        message: 'User created successfully',
      },
    };
  }
}
