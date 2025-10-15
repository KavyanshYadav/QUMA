import { z } from 'zod';

export const AuthCreateEmailRequestDTO = z.object({
  email: z.email(),
});
export const AuthCreateEmailResponseDTO = z.object({
  message: z.string(),
});

export const OAuthCreateEmailRequestDTO = z.object({
  email: z.email(),
  providerKEY: z.number(),
});
