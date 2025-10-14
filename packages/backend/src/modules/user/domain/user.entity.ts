import { randomUUID } from 'crypto';
import { AggregateRoot } from '@quma/ddd';
import { AggregateID } from '@quma/ddd';
import { CreateUserProps, UserProps, UserRoles } from './user.types.js';
import { UserCreatedDomainEvent } from './events/user-created-event.js';

export class UserEntity extends AggregateRoot<UserProps> {
  public override validate(): void {
    // throw new Error('Method not implemented.');
  }
  protected readonly _id!: AggregateID;

  constructor({ id, props }: { id: AggregateID; props: UserProps }) {
    super({ id, props });
    this._id = id;
  }

  static create(prop: CreateUserProps): UserEntity {
    const id = prop.id || randomUUID();
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
