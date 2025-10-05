import { z } from 'zod';

export const CreateUserRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  country: z.string().optional(),
});

export type CreateUserRequestSchemaType = z.infer<
  typeof CreateUserRequestSchema
>;
