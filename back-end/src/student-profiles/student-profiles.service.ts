import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PaginationFilterDto } from '../pagination/pagination.js';
import { StudentProfile } from './student-profiles.model.js';

@Injectable()
export class StudentProfilesService {
    constructor(@InjectModel(StudentProfile) private readonly studentProfileModel: typeof StudentProfile ) {}

    findByUserId(userId: number): Promise<StudentProfile | null> {
        return this.studentProfileModel.findOne({
            where: {
                userId,
            },
        });
    }

    updateStudentProfile(userId: number, updateData: Partial<StudentProfile>): Promise<[number, StudentProfile[]]> {
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