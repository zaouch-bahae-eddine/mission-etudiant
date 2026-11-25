import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoginService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(email: string, password: string): Promise<string> {
        const user = await this.userService.findByEmail(email);
        if (
            !user ||
            !(await bcrypt.compareSync(password, user?.passwordHash))
        ) {
            throw new HttpException(
                {
                    msg: 'Login or password incorrect',
                    errCode: 403,
                },
                HttpStatus.FORBIDDEN,
            );
        }
        return this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
        });
    }
}
