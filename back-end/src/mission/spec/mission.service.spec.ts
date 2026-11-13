import { Test, TestingModule } from '@nestjs/testing';
import { MissionsService } from '../missions.service.js';

describe('MissionsService', () => {
  let service: MissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionsService],
    }).compile();

    service = module.get<MissionsService>(MissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of missions', async () => {
    const result = await service.findAll({ page: 1, limit: 10, sortBy: 'id', sortOrder: 'ASC' });
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return a mission by id', async () => {
    const mission = await service.create({ title: 'Test Mission' });
    const foundMission = await service.findOne(mission.id);
    expect(foundMission).toBeDefined();
    expect(foundMission?.id).toEqual(mission.id);
  });

  it('should create a new mission', async () => {
    const mission = await service.create({ title: 'New Mission' });
    expect(mission).toBeDefined();
    expect(mission.title).toEqual('New Mission');
  });

  it('should update an existing mission', async () => {
    const mission = await service.create({ title: 'Update Mission' });
    const updatedMission = await service.update(mission.id, { title: 'Updated Mission' });
    expect(updatedMission).toBeDefined();
    expect(updatedMission?.title).toEqual('Updated Mission');
  });

  it('should delete a mission', async () => {
    const mission = await service.create({ title: 'Delete Mission' });
    const deleted = await service.delete(mission.id);
    expect(deleted).toBe(true);
    const foundMission = await service.findOne(mission.id);
    expect(foundMission).toBeNull();
  });
})
