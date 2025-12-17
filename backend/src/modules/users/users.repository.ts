import prisma from '../../prisma/client';

export class UserRepository {
    async findAll() {
        return prisma.user.findMany({
            select: { id: true, name: true, email: true }
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true }
        });
    }
}
