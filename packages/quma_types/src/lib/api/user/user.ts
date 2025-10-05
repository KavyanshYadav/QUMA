interface CreateUserRequest {
  email: string;
  password: string;
  username: string;
}

interface CreateUserResponse {
  userId: string;
  createdAt: string;
}

export type { CreateUserRequest, CreateUserResponse };
