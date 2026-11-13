import { Test, TestingModule } from '@nestjs/testing';
import { MissionsService } from '../missions.service.js';
import { AppModule } from '../../app.module.js';

describe('MissionsService', () => {
  let module: TestingModule;
  let service: MissionsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
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
    const mission = await service.create({ title: 'Test Mission', description: 'Test Description', datetime: new Date(), price: '100.00', location: 'Test Location' });
    const foundMission = await service.findOne(mission.id);
    expect(foundMission).toBeDefined();
    expect(foundMission?.id).toEqual(mission.id);
  });

  it('should create a new mission', async () => {
    const mission = await service.create({ title: 'New Mission', description: 'Test Description', datetime: new Date(), price: '100.00', location: 'Test Location' });
    expect(mission).toBeDefined();
    expect(mission.title).toEqual('New Mission');
  });

  it('should update an existing mission', async () => {
    const mission = await service.create({ title: 'Update Mission', description: 'Test Description', datetime: new Date(), price: '100.00', location: 'Test Location' });
    const updatedMission = await service.update(mission.id, { title: 'Updated Mission' });
    expect(updatedMission).toBeDefined();
    expect(updatedMission?.title).toEqual('Updated Mission');
  });

  it('should delete a mission', async () => {
    const mission = await service.create({ title: 'Delete Mission', description: 'Test Description', datetime: new Date(), price: '100.00', location: 'Test Location' });
    const deleted = await service.delete(mission.id);
    expect(deleted).toBe(true);
    const foundMission = await service.findOne(mission.id);
    expect(foundMission).toBeNull();
  });

  afterAll(async () => {
    await module.close();
  }); 
})
