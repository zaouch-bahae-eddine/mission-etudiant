import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class GoogleAuthService {
    private readonly client = new OAuth2Client();

    constructor(private readonly configService: ConfigService, private readonly userService: UsersService) {}

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
                email: payload.email,
                emailVerified: payload.email_verified,
                name: payload.name,
                picture: payload.picture,
            };
        } catch {
            throw new UnauthorizedException(
                'Google ID Token invalide ou expiré',
            );
        }
    }

    async login(idToekn: string) {
        const { googleId, email, name, picture } = await this.verifyToken(idToekn);
        if (email) {
            const user = this.userService.findByEmail(email);
            
        }
    }
}
