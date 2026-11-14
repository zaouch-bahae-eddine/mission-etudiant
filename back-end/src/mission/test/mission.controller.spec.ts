import { Test, TestingModule } from '@nestjs/testing';
import { MissionController } from '../mission.controller.js';
import { Mission } from '../mission.model.js';
import { AppModule } from '../../app.module.js';

describe('MissionController (integration)', () => {
  let module: TestingModule;
  let controller: MissionController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    controller = module.get<MissionController>(MissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return missions from PostgreSQL using the requested filters', async () => {
    const missions = await controller.getAllMission({
      page: 1,
      limit: 1,
      sortBy: 'id',
      sortOrder: 'DESC',
    });

    expect(missions).toHaveLength(1);
    expect(missions[0]).toBeInstanceOf(Mission);
  });

  it('should create a new mission in PostgreSQL', async () => {
    const newMission = await controller.createMission({
      title: 'Integration Test Mission',
      description: 'Integration Test Description',
      datetime: new Date(),
      price: '100.00',
      location: 'Integration Test Location',
    });

    expect(newMission).toBeDefined();
    expect(newMission.title).toEqual('Integration Test Mission');
  });

  it('should update an existing mission in PostgreSQL', async () => {
    const newMission = await controller.createMission({
      title: 'Integration Test Mission to Update',
      description: 'Integration Test Description',
      datetime: new Date(),
      price: '100.00',
      location: 'Integration Test Location',
    });

    const updatedMission = await controller.updateMission(newMission.id, {
      title: 'Updated Integration Test Mission',
      description: 'Updated Integration Test Description',
      datetime: new Date(),
      price: '150.00',
      location: 'Updated Integration Test Location',
    });

    expect(updatedMission).toBeDefined();
    expect(updatedMission?.title).toEqual('Updated Integration Test Mission');
  });

  it('should delete a mission from PostgreSQL', async () => {
    const newMission = await controller.createMission({
      title: 'Integration Test Mission to Delete',
      description: 'Integration Test Description',
      datetime: new Date(),
      price: '100.00',
      location: 'Integration Test Location',
    });

    const deleted = await controller.deleteMission(newMission.id);
    expect(deleted).toBe(true);

    const foundMission = await controller.getAllMission({
      page: 1,
      limit: 10,
      sortBy: 'id',
      sortOrder: 'ASC',
    });

    const missionExists = foundMission.some(mission => mission.id === newMission.id);
    expect(missionExists).toBe(false);
  });

  afterAll(async () => {
    await module.close();
  });
});
