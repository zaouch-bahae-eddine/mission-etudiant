import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { StudentProfileService } from '../student/profile/student-profile.service.js';
import { StudentAvailabilityService } from '../student/availability/student-availability.service.js';
import { StudentSkillService } from '../student/student-skills/student-skill.service.js';
import { StudentRegistrationSchemaDto } from '../student/dto/student-schema.dto.js';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly studentProfileService: StudentProfileService,
        private readonly studentAvailabilityService: StudentAvailabilityService,
        private readonly studentSkillService: StudentSkillService,
        private readonly sequelize: Sequelize,
    ) {}

    async registerStudent(studentData: StudentRegistrationSchemaDto): Promise<any> {
        const t = await this.sequelize.transaction();
        try {
            const user = await this.usersService.create(studentData.user, t);
            const profile = await this.studentProfileService.create(
                { ...studentData.profile, userId: user.id },
                t,
            );
            const availability = await this.studentAvailabilityService.bulkCreate(
                studentData.availability.map((sd) => ({ ...sd, studentId: user.id })),
                t,
            );
            const skills = await this.studentSkillService.bulkCreate(
                studentData.skills.map((sd) => ({ ...sd, studentId: user.id })),
                t,
            );

            await t.commit();

            return {
                user,
                profile,
                availability,
                skills,
            };
        } catch (err) {
            await t.rollback();
            throw err;
        }

        return {};
    }
}
