import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentAvailability } from './student-availability.model.js';
import {
    type StudentAvailabilityDto,
    type StudentAvailabilityUpdateDto,
} from './dto/student-availability.dto.js';
import { type Transaction } from 'sequelize';

export type CreateStudentAvailability = StudentAvailabilityDto;

export type UpdateStudentAvailability = StudentAvailabilityUpdateDto;

@Injectable()
export class StudentAvailabilityService {
    constructor(
        @InjectModel(StudentAvailability)
        private readonly studentAvailabilityModel: typeof StudentAvailability,
    ) {}

    findOne(id: number): Promise<StudentAvailability | null> {
        return this.studentAvailabilityModel.findByPk(id);
    }

    create(data: CreateStudentAvailability, transaction?: Transaction): Promise<StudentAvailability> {
        return this.studentAvailabilityModel.create(data, { transaction });
    }

    bulkCreate(data: CreateStudentAvailability[], transaction?: Transaction): Promise<StudentAvailability[]> {
        return this.studentAvailabilityModel.bulkCreate(data, { transaction })
    }

    async update(
        id: number,
        data: UpdateStudentAvailability,
    ): Promise<StudentAvailability | null> {
        const [, availabilities] = await this.studentAvailabilityModel.update(
            data,
            {
                where: { id },
                returning: true,
            },
        );
        return availabilities[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const deletedRows = await this.studentAvailabilityModel.destroy({
            where: { id },
        });
        return deletedRows > 0;
    }
}
