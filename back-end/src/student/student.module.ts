import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentProfile } from './profile/student-profile.model.js';
import { StudentProfileService } from './profile/student-profile.service.js';
import { StudentAvailability } from './availability/student-availability.model.js';
import { StudentAvailabilityService } from './availability/student-availability.service.js';

@Module({
    imports: [
        SequelizeModule.forFeature([StudentProfile, StudentAvailability]),
    ],
    providers: [StudentProfileService, StudentAvailabilityService],
    exports: [StudentProfileService, StudentAvailabilityService],
})
export class StudentModule {}
