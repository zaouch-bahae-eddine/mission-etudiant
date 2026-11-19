import { Body, Controller, Param, Patch } from '@nestjs/common';
import { StudentProfileService } from './profile/student-profile.service.js';
import { StudentAvailabilityService } from './availability/student-availability.service.js';
import { StudentSkillService } from './student-skills/student-skill.service.js';
import { type StudentProfileUpdateDto, studentProfileUpdateSchema } from './profile/dto/student-profile.dto.js';
import {
    type StudentAvailabilityRegistrationDto,
    studentAvailabilityRegistrationSchema,
} from './availability/dto/student-availability.dto.js';

@Controller()
export class StudentController {
    constructor(
        private readonly profileService: StudentProfileService,
        private readonly availabilityService: StudentAvailabilityService,
        private readonly studenSkillsService: StudentSkillService
    ) {}

    @Patch('/profile/:id')
    async updateProfile(@Param('id') userId: number, @Body({ schema: studentProfileUpdateSchema }) data: StudentProfileUpdateDto) {
        return await this.profileService.updateStudentProfile(userId, data);
    }

    @Patch('/availability/:studentId')
    async updateAvailability(
        @Param('studentId') studentId: number,
        @Body({ schema: studentAvailabilityRegistrationSchema })
        data: StudentAvailabilityRegistrationDto,
    ) {
        return this.availabilityService.updateForStudent(studentId, data);
    }
}
