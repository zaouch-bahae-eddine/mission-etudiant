import { Test, TestingModule } from '@nestjs/testing';
import { getTestingModule } from '../../test/setup.js';
import { UsersService } from '../users.service.js';

describe('UsersService', () => {
    let service: UsersService;

    beforeEach(async () => {
        service = getTestingModule().get<UsersService>(UsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return an array of users', async () => {
        const result = await service.findAll();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should return a user by id', async () => {
        const user = await service.create({
            username: 'testuser',
            password: 'testpassword',
        });
        const foundUser = await service.findOne(user.id);
        expect(foundUser).toBeDefined();
        expect(foundUser?.id).toEqual(user.id);
    });

    it('should create a new user', async () => {
        const user = await service.create({
            username: 'newuser',
            password: 'newpassword',
        });
        expect(user).toBeDefined();
        expect(user.username).toEqual('newuser');
    });

    it('should update an existing user', async () => {
        const user = await service.create({
            username: 'updateuser',
            password: 'updatepassword',
        });
        const updatedUser = await service.update(user.id, {
            username: 'updateduser',
        });
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.username).toEqual('updateduser');
    });

    it('should delete a user', async () => {
        const user = await service.create({
            username: 'deleteuser',
            password: 'deletepassword',
        });
        const deleted = await service.delete(user.id);
        expect(deleted).toBe(true);
        const foundUser = await service.findOne(user.id);
        expect(foundUser).toBeNull();
    });
});
