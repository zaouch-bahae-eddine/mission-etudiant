import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { type StudentSkillDto } from './dto/student-skill.dto.js';
import { StudentSkill } from './student-skill.model.js';
import { type Transaction } from 'sequelize';

@Injectable()
export class StudentSkillService {
    constructor(
        @InjectModel(StudentSkill)
        private readonly studentSkillModel: typeof StudentSkill,
    ) {}

    findOne(studentId: number, skillId: number): Promise<StudentSkill | null> {
        return this.studentSkillModel.findOne({
            where: { studentId, skillId },
        });
    }

    findByStudent(studentId: number): Promise<StudentSkill[]> {
        return this.studentSkillModel.findAll({ where: { studentId } });
    }

    create(data: StudentSkillDto): Promise<StudentSkill> {
        return this.studentSkillModel.create(data);
    }

    bulkCreate(
        data: StudentSkillDto[],
        transaction?: Transaction,
    ): Promise<StudentSkill[]> {
        return this.studentSkillModel.bulkCreate(data, { transaction });
    }
    async delete(studentId: number, skillId: number): Promise<boolean> {
        const deletedRows = await this.studentSkillModel.destroy({
            where: { studentId, skillId },
        });
        return deletedRows > 0;
    }
}
