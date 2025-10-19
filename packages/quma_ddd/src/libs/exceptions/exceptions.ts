import {
  ARGUMENT_INVALID,
  ARGUMENT_NOT_PROVIDED,
  ARGUMENT_OUT_OF_RANGE,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  REQUEST_CONTEXT_NOT_INITIALIZED,
} from './codes.js';
import { ExceptionBase } from './execptions.base.js';
import { ZodError } from 'zod';
/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends ExceptionBase {
  readonly code = ARGUMENT_INVALID;
}

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 * @extends {ExceptionBase}
 */
export class ArgumentNotProvidedException extends ExceptionBase {
  readonly code = ARGUMENT_NOT_PROVIDED;
}

/**
 * Used to indicate that an argument is out of allowed range
 * (for example: incorrect string/array length, number not in allowed min/max range etc)
 *
 * @class ArgumentOutOfRangeException
 * @extends {ExceptionBase}
 */
export class ArgumentOutOfRangeException extends ExceptionBase {
  readonly code = ARGUMENT_OUT_OF_RANGE;
}

/**
 * Used to indicate conflicting entities (usually in the database)
 *
 * @class ConflictException
 * @extends {ExceptionBase}
 */
export class ConflictException extends ExceptionBase {
  readonly code = CONFLICT;
}

/**
 * Used to indicate that entity is not found
 *
 * @class NotFoundException
 * @extends {ExceptionBase}
 */
export class NotFoundException extends ExceptionBase {
  static readonly message = 'Not found';

  constructor(message = NotFoundException.message) {
    super(message);
  }

  readonly code = NOT_FOUND;
}

/**
 * Used to indicate an internal server error that does not fall under all other errors
 *
 * @class InternalServerErrorException
 * @extends {ExceptionBase}
 */
export class InternalServerErrorException extends ExceptionBase {
  static readonly message = 'Internal server error';
  readonly Error: any;
  constructor(message = InternalServerErrorException.message, Error: any) {
    super(message);
    this.Error = Error;
  }

  readonly code = INTERNAL_SERVER_ERROR;
}

export class RequestContextErrorException extends ExceptionBase {
  static readonly message = 'Request context error';
  readonly code: string;
  constructor(
    message = RequestContextErrorException.message,
    ErrorCode = REQUEST_CONTEXT_NOT_INITIALIZED
  ) {
    super(message);

    this.code = ErrorCode;
  }
}

export class ParamsValidationErorrException extends ExceptionBase {
  readonly code = ARGUMENT_INVALID;
  readonly zodErrors: ZodError;
  constructor(zodError: ZodError) {
    super('validation failed');
    this.zodErrors = zodError;
  }
}
