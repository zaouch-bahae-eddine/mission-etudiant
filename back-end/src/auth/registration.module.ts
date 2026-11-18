import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import { StudentModule } from '../student/student.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
    imports: [StudentModule, UsersModule],
    exports: [RegistrationService],
    providers: [RegistrationService]
})
export class RegistrationModule {}
