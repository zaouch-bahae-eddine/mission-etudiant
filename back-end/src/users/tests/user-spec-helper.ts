import { faker } from '@faker-js/faker';
import { UserRole } from '../enums/user-role.enum.js';
import { UsersService } from '../users.service.js';
import { UserDto } from '../dto/user.dto.js';
import { getTestingModule } from '../../test/setup.js';

export class UserSpecHelper {
    usersService = getTestingModule().get<UsersService>(UsersService);
    userData = (overrideData?: Partial<UserDto>) => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash: faker.internet.password(),
        role: UserRole.STUDENT,
        ...overrideData,
    });
    createUserSpec = async (userData?: Partial<UserDto>) => {
        return await this.usersService.create(this.userData(userData));
    };
}
