import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { UserRole } from '../users/enums/user-role.enum.js';
import { LoginService } from './login.service.js';

@Injectable()
export class GoogleAuthService {
    private readonly client = new OAuth2Client();

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
        private readonly loginService: LoginService,
    ) {}

    async login(idToken: string, role: UserRole) {
        const { googleId, email, firstName, lastName } =
            await this.verifyToken(idToken);

        let user = await this.userService.findByUserProviderIdAndRole(
            googleId,
            role,
        );
        if (!user) {
            user = await this.userService.create({
                firstName,
                lastName,
                email,
                password: '',
                role,
                city: 'to define',
                postalCode: 'to define',
                userProviderId: googleId,
                provider: 'google',
            });
        }

        return this.loginService.generateTokens(user.id, user.role);
    }

    async verifyToken(idToken: string) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: idToken,
                audience:
                    this.configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
            });

            const payload = ticket.getPayload();

            if (!payload?.sub) {
                throw new UnauthorizedException('Google ID invalide');
            }

            return {
                googleId: payload.sub,
                email: payload.email ?? `${payload.sub}@autogen-google.com`,
                emailVerified: payload.email_verified,
                firstName: payload.name ?? 'first name',
                lastName: payload.family_name ?? 'last name',
                picture: payload.picture,
            };
        } catch {
            throw new UnauthorizedException(
                'Google ID Token invalide ou expiré',
            );
        }
    }
}
