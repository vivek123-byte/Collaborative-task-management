import prisma from '../../prisma/client';
import { RegisterInput } from './auth.dtos';

export class AuthRepository {
    async createUser(data: RegisterInput & { passwordHash: string }) {
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.passwordHash,
            },
        });
    }

    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async findUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async updateUser(id: string, data: { name?: string }) {
        return prisma.user.update({
            where: { id },
            data,
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
        });
    }
}
