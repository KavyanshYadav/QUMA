import {  randomUUID } from 'crypto';
import { AggregateRoot } from '../../../libs/ddd/aggregate.root';
import { AggregateID } from '../../../libs/ddd/entity.base';
import { CreateUserProps, UserProps, UserRoles } from './user.types';
import { UserCreatedDomainEvent } from './events/user-created-event';

export class UserEntity extends AggregateRoot<UserProps> {
  public override validate(): void {
    throw new Error('Method not implemented.');
  }
  protected readonly _id!: AggregateID;

  static create(prop: CreateUserProps): UserEntity {
    const id = randomUUID();
    const props: UserProps = { ...prop, role: UserRoles.guest };
    const user = new UserEntity({ id, props });

    user.addEvent(
      new UserCreatedDomainEvent({
        aggregateId: user.id,
        email: user.props.email,
        country: '',
        postalCode: '',
        street: '',
      })
    );
    return user;
  }

  get role(): UserRoles {
    return this.props.role;
  }

  //   makeAdmin(): void {
  //     this.changeRole(UserRoles.admin);
  //   }

  //   makeModerator(): void {
  //     this.changeRole(UserRoles.moderator);
  //   }

  //   delete(): void {
  //     this.addEvent(
  //       new UserDeletedDomainEvent({
  //         aggregateId: this.id,
  //       })
  //     );
}
