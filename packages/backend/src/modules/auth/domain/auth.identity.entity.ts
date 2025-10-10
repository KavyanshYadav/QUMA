import { AggregateID, AggregateRoot } from '@quma/quma_ddd_base';
import { CreateIdentityProp, IdentityProps } from './auth.entity.types';
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
