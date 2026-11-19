import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { type SkillDto, type SkillUpdateDto } from './dto/skill.dto.js';
import { Skill } from './skill.model.js';

@Injectable()
export class SkillService {
    constructor(
        @InjectModel(Skill) private readonly skillModel: typeof Skill,
    ) {}

    findOne(id: number): Promise<Skill | null> {
        return this.skillModel.findByPk(id);
    }

    create(data: SkillDto): Promise<Skill> {
        return this.skillModel.create(data);
    }

    async update(id: number, data: SkillUpdateDto): Promise<Skill | null> {
        const [, skills] = await this.skillModel.update(data, {
            where: { id },
            returning: true,
        });
        return skills[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const deletedRows = await this.skillModel.destroy({ where: { id } });
        return deletedRows > 0;
    }
}
