import { randomUUID } from 'crypto';
import { ArgumentNotProvidedException } from '../exceptions/index.js';
import { Guard } from '../utils/guard.js';
import { RequestContext } from '../application/context/AppRequestContex.js';

type DomainEventMetaData = {
  readonly timestamp: number;
  readonly correlationId: string;
  readonly causationId?: string;
  readonly userId?: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string;
  metadata?: DomainEventMetaData;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly metadata: DomainEventMetaData;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'DomainEvent props should not be empty'
      );
    }
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.metadata = {
      correlationId:
        props?.metadata?.correlationId || RequestContext.getRequestId(),
      causationId: props?.metadata?.causationId,
      timestamp: props?.metadata?.timestamp || Date.now(),
      userId: props?.metadata?.userId,
    };
  }
}
