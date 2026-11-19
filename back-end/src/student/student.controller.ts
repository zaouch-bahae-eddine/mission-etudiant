import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { StudentProfileService } from './profile/student-profile.service.js';
import { StudentAvailabilityService } from './availability/student-availability.service.js';
import { StudentSkillService } from './student-skills/student-skill.service.js';
import { type StudentProfileUpdateDto, studentProfileUpdateSchema } from './profile/dto/student-profile.dto.js';
import {
    type StudentAvailabilityRegistrationDto,
    studentAvailabilityRegistrationSchema,
} from './availability/dto/student-availability.dto.js';
import {
    type StudentSkillCreateDto,
    studentSkillCreateSchema,
} from './student-skills/dto/student-skill.dto.js';

@Controller('students/')
export class StudentController {
    constructor(
        private readonly profileService: StudentProfileService,
        private readonly availabilityService: StudentAvailabilityService,
        private readonly studentSkillsService: StudentSkillService,
    ) {}

    @Patch(':id/profile')
    async updateProfile(@Param('id') userId: number, @Body({ schema: studentProfileUpdateSchema }) data: StudentProfileUpdateDto) {
        return await this.profileService.updateStudentProfile(userId, data);
    }

    @Patch(':studentId/availability')
    async updateAvailability(
        @Param('studentId') studentId: number,
        @Body({ schema: studentAvailabilityRegistrationSchema })
        data: StudentAvailabilityRegistrationDto,
    ) {
        return this.availabilityService.updateForStudent(studentId, data);
    }

    @Post(':studentId/skills')
    async addStudentSkill(
        @Param('studentId') studentId: number,
        @Body({ schema: studentSkillCreateSchema }) data: StudentSkillCreateDto,
    ) {
        return this.studentSkillsService.create({
            studentId,
            skillId: data.skillId,
        });
    }

    @Delete('/:studentId/skills/:skillId')
    async deleteStudentSkill(
        @Param('studentId') studentId: number,
        @Param('skillId') skillId: number,
    ) {
        return this.studentSkillsService.delete(studentId, skillId);
    }
}
