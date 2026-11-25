import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationService } from './registration.service.js';
import {
    studentRegistrationSchemaDto,
    type StudentRegistrationSchemaDto,
} from '../student/dto/student-schema.dto.js';
import { type UserLoginDto, userLoginSchema } from '../users/dto/user.dto.js';
import { LoginService } from './login.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registrationService: RegistrationService,
        private readonly loginService: LoginService,
    ) {}

    @Post('register/student')
    async registerStudent(
        @Body({ schema: studentRegistrationSchemaDto })
        data: StudentRegistrationSchemaDto,
    ) {
        return await this.registrationService.registerStudent(data);
    }

    @Post('auth/login')
    async login(@Body({ schema: userLoginSchema }) input: UserLoginDto) {
        const jwt = await this.loginService.login(input.email, input.password);
        return {
            token: `Bearer ${jwt}`,
        }
    }
}
