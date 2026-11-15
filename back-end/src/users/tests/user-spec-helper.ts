import { faker } from '@faker-js/faker';
import { UserRole } from '../enums/user-role.enum.js';
import { UsersService } from '../users.service.js';
import { UserDto } from '../dto/user.dto.js';

export class UserSpecHelper {
    constructor(private readonly usersService: UsersService) {}

    userData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: UserRole.STUDENT,
    };
    createUserSpec = async (userData: Partial<UserDto>) => {
        return await this.usersService.create({
            ...this.userData,
            ...userData,
        });
    };
}
