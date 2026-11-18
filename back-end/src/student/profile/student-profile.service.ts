import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentProfile } from './student-profile.model.js';
import {
    type StudentProfileDto,
    type StudentProfileUpdateDto,
} from './dto/student-profile.dto.js';
import { type Transaction } from 'sequelize';

@Injectable()
export class StudentProfileService {
    constructor(
        @InjectModel(StudentProfile)
        private readonly studentProfileModel: typeof StudentProfile,
    ) {}

    findByUserId(userId: number): Promise<StudentProfile | null> {
        return this.studentProfileModel.findOne({
            where: {
                userId,
            },
        });
    }

    create(data: StudentProfileDto, transaction?: Transaction): Promise<StudentProfile> {
        return this.studentProfileModel.create(data, { transaction });
    }

    updateStudentProfile(
        userId: number,
        updateData: StudentProfileUpdateDto,
    ): Promise<[number, StudentProfile[]]> {
        return this.studentProfileModel.update(updateData, {
            where: { userId },
            returning: true,
        });
    }

    deleteStudentProfile(userId: number): Promise<number> {
        return this.studentProfileModel.destroy({
            where: { userId },
        });
    }
}
