import { Test, TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../../test/setup.js';
import { UsersService } from '../users.service.js';
import { UserSpecHelper } from './user-spec-helper.js';

describe('UsersService', () => {
    let service: UsersService;
    let userHelper: UserSpecHelper;

    beforeAll(async () => {
        service = getTestingModule().get<UsersService>(UsersService);
        userHelper = new UserSpecHelper();
    });

    beforeEach(async () => {
        service = getTestingModule().get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return an array of users', async () => {
        const result = await service.findAll({
            page: 1,
            limit: 10,
        });
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return a user by id', async () => {
        const user = await userHelper.createUserSpec();
        const foundUser = await service.findOne((await user).id);
        expect(foundUser).toBeDefined();
        expect(foundUser?.id).toEqual((await user).id);
    });

    it('should create a new user', async () => {
        const user = await userHelper.createUserSpec({ firstName: 'newuser' });
        expect(user).toBeDefined();
        expect(user.firstName).toEqual('newuser');
    });

    it('should update an existing user', async () => {
        const user = await userHelper.createUserSpec({
            firstName: 'updateduser',
        });
        const updatedUser = await service.update(user.id, {
            firstName: 'updateduser',
        });
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.firstName).toEqual('updateduser');
    });

    it('should delete a user', async () => {
        const user = await userHelper.createUserSpec({
            firstName: 'deleteuser',
        });

        const deleted = await service.delete(user.id);
        expect(deleted).toBe(true);
        const foundUser = await service.findOne(user.id);
        expect(foundUser).toBeNull();
    });
});
