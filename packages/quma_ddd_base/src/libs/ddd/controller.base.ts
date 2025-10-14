import type {
  RouteKey,
  RouteBody,
  RouteParams,
  RouteQuery,
  RouteSuccessResponse,
} from '@quma/config';

type ControllerRequest<K extends RouteKey> = {
  params: RouteParams<K>;
  query: RouteQuery<K>;
  body: RouteBody<K>;
};

type ControllerResponse<K extends RouteKey> = RouteSuccessResponse<K>;
