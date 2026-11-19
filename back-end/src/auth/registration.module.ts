import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import { StudentModule } from '../student/student.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';

@Module({
    imports: [StudentModule, UsersModule],
    exports: [RegistrationService],
    providers: [RegistrationService],
    controllers: [AuthController],
})
export class RegistrationModule {}
