import { AggregateID, AggregateRoot } from '@quma/ddd';
import { CreateIdentityProp, IdentityProps } from './auth.entity.types.js';
import { randomUUID } from 'crypto';

export class IdentityEntity extends AggregateRoot<IdentityProps> {
  protected override readonly _id!: AggregateID;

  public override validate(): void {
    //asd
  }

  static create(prop: CreateIdentityProp): IdentityEntity {
    const id = randomUUID();
    const props: IdentityProps = { ...prop, id };
    const entity = new IdentityEntity({ id, props });
    return entity;
  }
}
