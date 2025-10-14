import { ApiCommand } from './api.commands.js';

export type ApiSuccessResponse<T> = {
  status: 'success';
  data: T;
  command?: ApiCommand;
};

export type ApiErrorResponse = {
  status: 'error';
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
