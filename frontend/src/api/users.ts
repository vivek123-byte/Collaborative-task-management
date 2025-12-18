import client from './client';

export interface User {
    id: string;
    name: string;
    email: string;
}

export const getUsers = async () => {
    const response = await client.get<User[]>('/users');
    return response.data;
};
