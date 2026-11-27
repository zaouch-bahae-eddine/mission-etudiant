import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../users/enums/user-role.enum.js';

@Injectable()
export class LoginService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(
        email: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.userService.findByEmail(email);

        if (Boolean(user?.provider)) {
            throw new HttpException(
                {
                    msg: 'Methode not allowed',
                    errCode: 403,
                },
                HttpStatus.FORBIDDEN,
            );
        }

        if (!user || !bcrypt.compareSync(password, user?.passwordHash)) {
            throw new HttpException(
                {
                    msg: 'Login or password incorrect',
                    errCode: 403,
                },
                HttpStatus.FORBIDDEN,
            );
        }

        return this.generateTokens(user.id, user.role);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException();
            }

            const accessToken = await this.jwtService.signAsync(
                {
                    sub: payload.sub,
                    type: 'access',
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '15m',
                },
            );

            return { accessToken };
        } catch {
            throw new UnauthorizedException('Refresh Token invalide ou expiré');
        }
    }

    async generateTokens(userId: number, userRole: UserRole) {
        const accessToken = await this.jwtService.signAsync(
            { sub: userId, type: 'access', role: userRole },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            { sub: userId, type: 'refresh' },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    async googleLogin() {}
}
