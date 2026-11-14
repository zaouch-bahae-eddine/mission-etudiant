import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Mission } from './mission.model.js';
import { MissionController } from './mission.controller.js';
import { MissionsService } from './missions.service.js';

@Module({
  imports: [SequelizeModule.forFeature([Mission])],
  controllers: [MissionController],
  providers: [MissionsService],
  exports: [MissionsService],
})
export class MissionsModule {}