import { Test, TestingModule } from '@nestjs/testing';
import { MissionsService } from '../missions.service.js';
import { AppModule } from '../../app.module.js';
import { getTestingModule } from '../../test/setup.js';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';

describe('MissionsService', () => {
    let service: MissionsService;
    let userHelper: UserSpecHelper;

    beforeAll(async () => {
        service = getTestingModule().get<MissionsService>(MissionsService);
        userHelper = new UserSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.concurrent('should return an array of missions', async () => {
        const result = await service.findAll({
            page: 1,
            limit: 10,
            sortBy: 'id',
            sortOrder: 'ASC',
        });
        expect(Array.isArray(result)).toBe(true);
    });

    it.concurrent('should return a mission by id', async () => {
        const user = await userHelper.createUserSpec();
        const mission = await service.create({
            title: 'Test Mission',
            description: 'Test Description',
            datetime: new Date(),
            price: '100.00',
            location: 'Test Location',
            authorId: user.id,
        });
        const foundMission = await service.findOne(mission.id);
        expect(foundMission).toBeDefined();
        expect(foundMission?.id).toEqual(mission.id);
    });

    it.concurrent('should create a new mission', async () => {
        const user = await userHelper.createUserSpec();
        const mission = await service.create({
            title: 'New Mission',
            description: 'Test Description',
            datetime: new Date(),
            price: '100.00',
            location: 'Test Location',
            authorId: user.id,
        });
        expect(mission).toBeDefined();
        expect(mission.title).toEqual('New Mission');
    });

    it.concurrent('should update an existing mission', async () => {
        const user = await userHelper.createUserSpec();
        const mission = await service.create({
            title: 'Update Mission',
            description: 'Test Description',
            datetime: new Date(),
            price: '100.00',
            location: 'Test Location',
            authorId: user.id,
        });
        const updatedMission = await service.update(mission.id, {
            title: 'Updated Mission',
        });
        expect(updatedMission).toBeDefined();
        expect(updatedMission?.title).toEqual('Updated Mission');
    });

    it.concurrent('should delete a mission', async () => {
        const user = await userHelper.createUserSpec();
        const mission = await service.create({
            title: 'Delete Mission',
            description: 'Test Description',
            datetime: new Date(),
            price: '100.00',
            location: 'Test Location',
            authorId: user.id,
        });
        const deleted = await service.delete(mission.id);
        expect(deleted).toBe(true);
        const foundMission = await service.findOne(mission.id);
        expect(foundMission).toBeNull();
    });
});
