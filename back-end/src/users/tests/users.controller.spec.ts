import { HttpStatus } from '@nestjs/common';
import { UsersController } from '../users.controller.js';
import { getTestingModule } from '../../test/setup.js';
import { UserSpecHelper } from './user-spec-helper.js';

describe('UsersController', () => {
    let controller: UsersController;
    let userHelper: UserSpecHelper;

    beforeEach(async () => {
        controller = getTestingModule().get<UsersController>(UsersController);
        userHelper = new UserSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it.concurrent('should return an array of users', async () => {
        const result = await controller.getAllUsers({
            page: 1,
            limit: 10,
        });
        expect(Array.isArray(result)).toBe(true);
    });

    it.concurrent('should create a new user', async () => {
        const user = await userHelper.createUserSpec({
            firstName: 'newuser',
        });
        expect(user).toBeDefined();
        expect(user.firstName).toEqual('newuser');
    });

    it.concurrent('should update an existing user', async () => {
        const user = await userHelper.createUserSpec({
            firstName: 'originaluser',
        });
        const updatedUser = await controller.updateUser(
            user.id,
            { firstName: 'updateduser' },
            user,
        );
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.firstName).toEqual('updateduser');
    });

    it.concurrent('should forbid updating another user', async () => {
        const currentUser = await userHelper.createUserSpec();
        const otherUser = await userHelper.createUserSpec();

        await expect(
            controller.updateUser(
                otherUser.id,
                { firstName: 'updateduser' },
                currentUser,
            ),
        ).rejects.toMatchObject({ status: HttpStatus.FORBIDDEN });
    });

    it.concurrent('should delete a user', async () => {
        const user = await userHelper.createUserSpec({
            firstName: 'deleteuser',
        });
        const deleted = await controller.deleteUser(user.id);
        expect(deleted).toBe(true);
    });
});
