export interface UserRequestDto {
  email: string;
  password: string;
  name: string;

  country: string;
}
export class UserResponseDto {
  id: string;
  email: string;
  name: string;

  country: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    country: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.country = country;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
