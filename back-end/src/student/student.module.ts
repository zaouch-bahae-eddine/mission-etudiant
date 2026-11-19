import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentProfile } from './profile/student-profile.model.js';
import { StudentProfileService } from './profile/student-profile.service.js';
import { StudentAvailability } from './availability/student-availability.model.js';
import { StudentAvailabilityService } from './availability/student-availability.service.js';
import { Skill } from './skills/skill.model.js';
import { SkillService } from './skills/skill.service.js';
import { StudentSkill } from './student-skills/student-skill.model.js';
import { StudentSkillService } from './student-skills/student-skill.service.js';
import { StudentController } from './student.controller.js';

@Module({
    imports: [
        SequelizeModule.forFeature([
            StudentProfile,
            StudentAvailability,
            Skill,
            StudentSkill,
        ]),
    ],
    providers: [
        StudentProfileService,
        StudentAvailabilityService,
        SkillService,
        StudentSkillService,
    ],
    exports: [
        StudentProfileService,
        StudentAvailabilityService,
        SkillService,
        StudentSkillService,
    ],
    controllers: [StudentController],
})
export class StudentModule {}
