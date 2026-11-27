import { Body, Controller, Post } from '@nestjs/common';
import {
    type UserGoogleLoginDto,
    userGoogleLoginSchema,
    type UserLoginDto,
    userLoginSchema,
    userSchema,
    type UserDto,
} from '../users/dto/user.dto.js';
import { LoginService } from './login.service.js';
import { GoogleAuthService } from './google-auth.service.js';
import { UsersService } from '../users/users.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UsersService,
        private readonly loginService: LoginService,
        private readonly googleAuthService: GoogleAuthService,
    ) {}

    @Post('register')
    async registerStudent(
        @Body({ schema: userSchema })
        data: UserDto,
    ) {
        return await this.userService.create(data);
    }

    @Post('login')
    async login(@Body({ schema: userLoginSchema }) input: UserLoginDto) {
        return await this.loginService.login(input.email, input.password);
    }

    @Post('/google/login')
    async googleLogin(
        @Body({ schema: userGoogleLoginSchema }) input: UserGoogleLoginDto,
    ) {
        return await this.googleAuthService.login(input.idToken);
    }

    @Post('refresh')
    refresh(@Body('refreshToken') refreshToken: string) {
        return this.loginService.refresh(refreshToken);
    }
}
