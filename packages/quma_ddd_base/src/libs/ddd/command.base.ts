import { RequestContext } from '../application/context/AppRequestContex.js';
import { ArgumentNotProvidedException } from '../exceptions/index.js';
import { Guard } from '../utils/guard.js';

type CommandMetaData = {
  readonly correlationId: string;
  readonly causationId?: string;
  readonly userId?: string;
  readonly timestamp: Date;
};

export type CommandProps<T> = Omit<T, 'id' | 'metadata'> & Partial<Command>;

export class Command {
  readonly id: string;
  readonly metadata: CommandMetaData;

  constructor(props: CommandProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException('Command should not be empty');
    }
    const ctx = RequestContext.getContext();
    this.id = (props as any).id || ''; // TODO: generate unique id if not provided
    this.metadata = {
      correlationId: ctx.requestId,
      causationId: (props as any).metadata?.correlationId,
      userId: (props as any).metadata?.userId,
      timestamp: new Date(),
    };
  }
}
