import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import {
    studentRegistrationSchemaDto,
    type StudentRegistrationSchemaDto,
} from '../student/dto/student-schema.dto.js';
import { type UserGoogleLoginDto, userGoogleLoginSchema, type UserLoginDto, userLoginSchema } from '../users/dto/user.dto.js';
import { LoginService } from './login.service.js';
import { GoogleAuthService } from './google-auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly loginService: LoginService,
        private readonly googleAuthService: GoogleAuthService
    ) {}

    @Post('register/student')
    async registerStudent(
        @Body({ schema: studentRegistrationSchemaDto })
        data: StudentRegistrationSchemaDto,
    ) {
        return await this.registrationService.registerStudent(data);
    }

    @Post('login')
    async login(@Body({ schema: userLoginSchema }) input: UserLoginDto) {
        return await this.loginService.login(input.email, input.password);
    }

    @Post('/google/login')
    async googleLogin(@Body({ schema: userGoogleLoginSchema }) input: UserGoogleLoginDto) {
        return await this.googleAuthService.login(input.idToken, input.role);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
        return this.loginService.refresh(refreshToken);
    }
}
