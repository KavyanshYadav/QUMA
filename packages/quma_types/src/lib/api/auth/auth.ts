import { z } from 'zod';

export const AuthEmailRequestDTO = z.object({
  email: z.email(),
  profile: z.string(),
});

export type AuthEmailRequestDTOzod = z.infer<typeof AuthEmailRequestDTO>;
