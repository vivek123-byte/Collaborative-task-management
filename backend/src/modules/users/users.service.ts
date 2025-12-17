import { UserRepository } from './users.repository';

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async getAllUsers() {
        return this.repository.findAll();
    }
}
