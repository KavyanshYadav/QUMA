import { Domain } from 'domain';
import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';
import { Logger } from 'winston';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents(): DomainEvent[] {
    return this._domainEvents;
  }
  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  //   public async publishEvent(
  //     logger:Logger,
  //     eventEmitter:
  //   )
}
