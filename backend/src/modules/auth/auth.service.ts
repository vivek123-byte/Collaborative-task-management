import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { RegisterInput, LoginInput, UpdateProfileInput } from './auth.dtos';
import { AppError } from '../../errors/AppError';
import { JWT_SECRET } from '../../config/env';

export class AuthService {
    private repository: AuthRepository;

    constructor() {
        this.repository = new AuthRepository();
    }

    async register(data: RegisterInput) {
        const existingUser = await this.repository.findUserByEmail(data.email);
        if (existingUser) {
            throw new AppError('User already exists', 409);
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await this.repository.createUser({ ...data, passwordHash });

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(data: LoginInput) {
        const user = await this.repository.findUserByEmail(data.email);
        if (!user) {
            throw new AppError('Invalid credentials', 401);
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isValid) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        const { passwordHash: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async getUser(userId: string) {
        const user = await this.repository.findUserById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateProfile(userId: string, data: UpdateProfileInput) {
        const existing = await this.repository.findUserById(userId);
        if (!existing) {
            throw new AppError('User not found', 404);
        }

        const user = await this.repository.updateUser(userId, data);
        return user;
    }
}
