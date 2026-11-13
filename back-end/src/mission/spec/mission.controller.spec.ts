import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { MissionController } from '../mission.controller.js';
import { MissionsModule } from '../missions.module.js';
import { Mission } from '../mission.model.js';

describe('MissionController (integration)', () => {
  let module: TestingModule;
  let controller: MissionController;
  let mission: Mission;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          dialect: 'postgres',
          host: process.env.TEST_DB_HOST ?? 'localhost',
          port: Number(process.env.TEST_DB_PORT ?? 5432),
          username: process.env.TEST_DB_USER ?? 'dev',
          password: process.env.TEST_DB_PASSWORD ?? 'dev123',
          database: 'nestjs_db',
          autoLoadModels: true,
          synchronize: false,
          logging: false,
          retryAttempts: 1,
        }),
        MissionsModule,
      ],
    }).compile();
    controller = module.get(MissionController);
    mission = await Mission.create({
      title: `Controller integration test ${crypto.randomUUID()}`,
      description: 'Mission created by the controller integration test',
      datetime: new Date('2026-01-01T12:00:00Z'),
      price: '25.00',
      location: 'Paris',
    });
  }, 15000);

  afterAll(async () => {
    try {
      if (mission) await mission.destroy();
    } finally {
      if (module) await module.close();
    }
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
    expect(missions[0].id).toBe(mission.id);
    expect(missions[0].title).toBe(mission.title);
  });
});
