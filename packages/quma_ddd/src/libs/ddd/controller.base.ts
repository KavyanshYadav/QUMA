import {
  type RouteKey,
  type RouteBody,
  type RouteParams,
  type RouteQuery,
  type RouteSuccessResponse,
  getRouteConfigFromKey,
  RouteConfigWithKey,
} from '@quma/config';

import { Response, Request } from 'express';
import { ExceptionBase } from '../exceptions/execptions.base.js';
import { ZodError } from 'zod';
import {
  InternalServerErrorException,
  ParamsValidationErorrException,
} from '../exceptions/exceptions.js';
import { RequestContext } from '../application/index.js';

export type ControllerRequest<K extends RouteKey> = {
  params: RouteParams<K>;
  query: RouteQuery<K>;
  body: RouteBody<K>;
};

// Controller response type — automatically infers the success response type
export type ControllerResponse<K extends RouteKey> = {
  statusCode: 200 | 201;
  data: RouteSuccessResponse<K>;
};
export abstract class BaseController<R extends { key: RouteKey }> {
  protected static ROUTE: { key: RouteKey };

  protected get routerKey(): R['key'] {
    const route = (
      this.constructor as typeof BaseController & { ROUTE: { key: string } }
    ).ROUTE;
    if (!route?.key) throw new Error('ROUTE.key is not defined');
    return route.key;
  }

  protected async authorize(
    req: Request,
    res: Response,
    routeConfig: RouteConfigWithKey
  ) {
    if (!routeConfig.public) {
      try {
        const userid = RequestContext.getContext().userId;
        if (!userid) {
          res.status(401);
          return;
        }
      } catch (err) {
        this.handleError(res, err);
      }
    }
    return;
  }

  // Subclasses implement business logic here without specifying types explicitly.
  // Contextual typing enforces (req) and return to match the route key.

  protected abstract execute(
    req: ControllerRequest<R['key']>
  ): Promise<ControllerResponse<R['key']>>;

  public async handle(req: Request, res: Response) {
    const routeConfig = getRouteConfigFromKey(this.routerKey);
    if (!routeConfig) throw new Error('Wrong routeConfig');

    this.authorize(req, res, routeConfig);
    if (res.headersSent) return;

    try {
      const validatedParams =
        routeConfig.schemas.params?.parse(req.params) ??
        ({} as Record<string, never>);
      const validatedQuery =
        routeConfig.schemas.query?.parse(req.query) ??
        ({} as Record<string, never>);
      const validatedBody =
        routeConfig.schemas.body?.parse(req.body) ??
        ({} as Record<string, never>);

      const result = await this.execute({
        params: validatedParams as RouteParams<R['key']>,
        query: validatedQuery as RouteQuery<R['key']>,
        body: validatedBody as RouteBody<R['key']>,
      });

      res.status(result.statusCode).json(result.data);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    let domainError: ExceptionBase;

    if (error instanceof ExceptionBase) {
      domainError = error;
    } else if (error instanceof ZodError) {
      domainError = new ParamsValidationErorrException(error);
    } else {
      domainError = new InternalServerErrorException('', error);
    }
    console.log(domainError);
    const status = this.mapErrorToStatus(domainError);

    return res.status(status).json(domainError.toJSON());
  }

  private mapErrorToStatus(error: ExceptionBase): number {
    switch (error.code) {
      case 'ARGUMENT_INVALID':
      case 'ARGUMENT_NOT_PROVIDED':
      case 'ARGUMENT_OUT_OF_RANGE':
        return 400;
      case 'NOT_FOUND':
        return 404;
      case 'CONFLICT':
        return 409;
      case 'REQUEST_CONTEXT_NOT_INITIALIZED':
        return 500;
      default:
        return 500;
    }
  }
}
