import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Mission } from './mission.model.js';


@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission)
    private readonly missionModel: typeof Mission,
  ) {}

  async findAll(): Promise<Mission[]> {
    return this.missionModel.findAll();
  }

  async findOne(id: number): Promise<Mission | null> {
    return this.missionModel.findByPk(id);
  }
}