import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import { StudentModule } from '../student/student.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwtAuth.guard.js';
import { LoginService } from './login.service.js';
import { GoogleAuthService } from './google-auth.service.js';

@Module({
    imports: [
        ConfigModule,
        StudentModule,
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
                signOptions: {
                    expiresIn: '15m',
                },
            }),
        }),
    ],
    exports: [
        RegistrationService,
        JwtAuthGuard,
        JwtModule,
        LoginService,
        GoogleAuthService,
    ],
    providers: [
        RegistrationService,
        JwtAuthGuard,
        LoginService,
        GoogleAuthService,
    ],
    controllers: [AuthController],
})
export class RegistrationModule {}
