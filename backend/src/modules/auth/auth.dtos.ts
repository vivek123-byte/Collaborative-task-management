import { z } from 'zod';

export const RegisterDto = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
});

export const LoginDto = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const UpdateProfileDto = z.object({
    name: z.string().min(2).max(50),
});

export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileDto>;
