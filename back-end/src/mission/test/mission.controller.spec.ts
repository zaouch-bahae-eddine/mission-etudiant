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
});
