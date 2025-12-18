import client from './client';
import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const UpdateProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const login = async (data: LoginInput) => {
    const response = await client.post('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterInput) => {
    const response = await client.post('/auth/register', data);
    return response.data;
};

export const logout = async () => {
    const response = await client.post('/auth/logout');
    return response.data;
};

export const getMe = async () => {
    const response = await client.get('/auth/me');
    return response.data;
};

export const updateProfile = async (data: UpdateProfileInput) => {
    const response = await client.patch('/auth/me', data);
    return response.data;
};
