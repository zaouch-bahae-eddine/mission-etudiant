import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Mission } from './mission.model.js';
import { type PaginationFilterDto } from '../pagination/pagination.js';


@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission)
    private readonly missionModel: typeof Mission,
  ) {}

  async findAll(filters: PaginationFilterDto): Promise<Mission[]> {
    return this.missionModel.findAll({
      limit: filters.limit,
      offset: (filters.page - 1) * filters.limit,
      order: filters.sortBy
        ? [[filters.sortBy, filters.sortOrder || 'ASC']]
        : undefined,
    });
  }

  async findOne(id: number): Promise<Mission | null> {
    return this.missionModel.findByPk(id);
  }

  async create(mission: Partial<Mission>): Promise<Mission> {
    return this.missionModel.create(mission);
  }

  async update(id: number, mission: Partial<Mission>): Promise<Mission | null> {
    const [affectedRows] = await this.missionModel.update(mission, {
      where: { id },
    });
    if (affectedRows === 0) {
      return null;
    }
    return this.findOne(id);
  }

  async delete(id: number): Promise<boolean> {
    const deletedRows = await this.missionModel.destroy({
      where: { id },
    });
    return deletedRows > 0;
  }
}