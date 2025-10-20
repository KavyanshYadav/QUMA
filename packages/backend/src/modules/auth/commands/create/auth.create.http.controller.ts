/* eslint-disable @nx/enforce-module-boundaries */
import { injectable, inject } from 'tsyringe';
import {
  MemoryBus,
  BaseController,
  Logger,
  RequestContext,
  ControllerRequest,
  ControllerResponse,
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
    req: ControllerRequest<'auth:create:withEmail'>
  ): Promise<ControllerResponse<'auth:create:withEmail'>> {
    // const para = req.body;

    Logger.info('sad', RequestContext.getContext());
    await this.memoryBus.execute(
      new CreateAuthWithEmailCommand({
        email: 'asdas@email.com',
        profile: 'Asds',
      })
    );
    return {
      statusCode: 201 as const,
      data: {
        message: 'User created successfully',
      },
    };
  }
}
