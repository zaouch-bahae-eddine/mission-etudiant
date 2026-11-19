import { faker } from '@faker-js/faker';
import { UserRole } from '../enums/user-role.enum.js';
import { UsersService } from '../users.service.js';
import { type UserDto, type UserUpdateDto } from '../dto/user.dto.js';
import { getTestingModule } from '../../test/setup.js';

export class UserSpecHelper {
    usersService = getTestingModule().get(UsersService);

    userData(overrides: Partial<UserDto> = {}): UserDto {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 16 }),
            role: UserRole.STUDENT,
            city: faker.location.city(),
            postalCode: faker.location.zipCode('#####'),
            ...overrides,
        };
    }

    async createUserSpec(overrides: Partial<UserDto> = {}) {
        return this.usersService.create(this.userData(overrides));
    }

    async updateUserSpec(id: number, data: UserUpdateDto) {
        const { password, ...fields } = data;
        const update =
            password === undefined
                ? fields
                : {
                      ...fields,
                      passwordHash:
                          await this.usersService.hashPassword(password),
                  };
        return this.usersService.update(id, update);
    }
}
