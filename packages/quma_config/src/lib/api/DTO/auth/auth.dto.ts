import { z } from 'zod';

export const AuthCreateEmailRequestDTO = z.object({
  email: z.string().email(),
});
export const AuthCreateEmailResponseDTO = z.object({
  message: z.string(),
});

export const OAuthCreateEmailRequestDTO = z.object({
  email: z.string().email(),
  providerKEY: z.number(),
});

export const OAuthCreateEmailResponseDTO = z.object({
  message: z.string(),
});

export const ApiErrorSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
