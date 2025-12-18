import { AuthService } from '../modules/auth/auth.service';
import { AuthRepository } from '../modules/auth/auth.repository';
import { AppError } from '../errors/AppError';
import bcrypt from 'bcrypt';

jest.mock('../modules/auth/auth.repository');
jest.mock('bcrypt');

const MockRepo = AuthRepository as jest.MockedClass<typeof AuthRepository>;

describe('AuthService', () => {
    let service: AuthService;
    let repo: jest.Mocked<AuthRepository>;

    beforeEach(() => {
        repo = new MockRepo() as any;
        service = new AuthService();
        service['repository'] = repo;
    });

    it('register throws 409 when user exists', async () => {
        repo.findUserByEmail.mockResolvedValue({ id: '1', email: 'a@test.com', passwordHash: 'x', name: 'A' } as any);

        await expect(
            service.register({ name: 'A', email: 'a@test.com', password: 'secret123' })
        ).rejects.toEqual(new AppError('User already exists', 409));
    });

    it('login throws 401 when user not found', async () => {
        repo.findUserByEmail.mockResolvedValue(null as any);

        await expect(
            service.login({ email: 'missing@test.com', password: 'secret123' })
        ).rejects.toEqual(new AppError('Invalid credentials', 401));
    });

    it('login throws 401 when password invalid', async () => {
        repo.findUserByEmail.mockResolvedValue({ id: '1', email: 'a@test.com', passwordHash: 'hash', name: 'A' } as any);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(
            service.login({ email: 'a@test.com', password: 'wrong' })
        ).rejects.toEqual(new AppError('Invalid credentials', 401));
    });
});
