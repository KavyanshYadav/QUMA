import {
  type RouteKey,
  type RouteBody,
  type RouteParams,
  type RouteQuery,
  type RouteSuccessResponse,
  getRouteConfigFromKey,
} from '@quma/config';

import { Response, Request } from 'express';

type ControllerRequest<K extends RouteKey> = {
  params: RouteParams<K>;
  query: RouteQuery<K>;
  body: RouteBody<K>;
};

type ControllerResponse<K extends RouteKey> = {
  statusCode: 200 | 201;
  data: RouteSuccessResponse<K>;
};
export abstract class BaseController<K extends RouteKey> {
  protected abstract execute(
    req: ControllerRequest<K>
  ): Promise<ControllerResponse<K>>;

  protected abstract getRouterKey(): K;

  public async handle(req: Request, res: Response) {
    const routerkey = this.getRouterKey();
    const routeConfig = getRouteConfigFromKey(routerkey);

    const validatedParams = routeConfig.schemas.params?.parse(req.params) ?? {};
    const validatedQuery = routeConfig.schemas.query?.parse(req.query) ?? {};
    const validatedBody = routeConfig.schemas.body?.parse(req.body) ?? {};

    const result = await this.execute({
      params: validatedParams,
      query: validatedQuery,
      body: validatedBody,
    });

    res.status(result.statusCode).json(result.data);
  }
}
