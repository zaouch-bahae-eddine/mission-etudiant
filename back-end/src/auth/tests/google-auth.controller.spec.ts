import { HttpStatus, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginTicket, type VerifyIdTokenOptions } from 'google-auth-library';
import { randomBytes } from 'node:crypto';
import request from 'supertest';
import { vi } from 'vitest';
import { getTestingModule } from '../../test/setup.js';
import { UserRole } from '../../users/enums/user-role.enum.js';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';
import { UsersService } from '../../users/users.service.js';
import { GoogleAuthService } from '../google-auth.service.js';

describe('Google login (HTTP)', () => {
    const path = '/auth/google/login';
    const avatarKey = 'https://example.com/avatar.png';
    const idToken = 'google-id-token';
    const firstName = 'Camille';
    const lastName = 'Martin';
    let app: INestApplication;
    let usersService: UsersService;
    let userHelper: UserSpecHelper;
    let jwt: JwtService;
    let audience: string;
    let googleId: string;
    let email: string;
    let client: {
        verifyIdToken(options: VerifyIdTokenOptions): Promise<LoginTicket>;
    };

    beforeAll(async () => {
        const module = getTestingModule();
        client = module.get(GoogleAuthService)['client'];
        usersService = module.get(UsersService);
        userHelper = new UserSpecHelper();
        jwt = module.get(JwtService);
        audience =
            module.get(ConfigService).get<string>('GOOGLE_CLIENT_ID') ??
            'google-login-test-client';
        app = module.createNestApplication();
        await app.init();
    });

    beforeEach(() => {
        vi.stubEnv('GOOGLE_CLIENT_ID', audience);
        googleId = randomBytes(10).toString('hex');
        email = `${googleId}@example.com`;
    });

    afterEach(async () => {
        vi.restoreAllMocks();
        vi.unstubAllEnvs();
        const user = await usersService.findByEmail(email);
        if (user) await usersService.delete(user.id);
    });

    function verifiedTicket() {
        const issuedAt = Math.floor(Date.now() / 1000);
        return new LoginTicket(undefined, {
            iss: 'https://accounts.google.com',
            aud: audience,
            sub: googleId,
            email,
            email_verified: true,
            name: firstName,
            family_name: lastName,
            picture: avatarKey,
            iat: issuedAt,
            exp: issuedAt + 3600,
        });
    }

    it('creates a Google user and issues signed access and refresh tokens', async () => {
        const verifyIdToken = vi
            .spyOn(client, 'verifyIdToken')
            .mockResolvedValue(verifiedTicket());

        const { body } = await request(app.getHttpServer())
            .post(path)
            .send({ idToken })
            .expect(HttpStatus.CREATED);

        expect(verifyIdToken).toHaveBeenCalledExactlyOnceWith({
            idToken,
            audience,
        });
        const user = await usersService.findByEmail(email);
        expect(user).toMatchObject({
            firstName,
            lastName,
            email,
            role: UserRole.CLIENT,
            userProviderId: googleId,
            provider: 'google',
            avatarKey,
            city: null,
            postalCode: null,
        });
        await expect(jwt.verifyAsync(body.accessToken)).resolves.toMatchObject({
            sub: user!.id,
            type: 'access',
            role: UserRole.CLIENT,
        });
        await expect(
            jwt.verifyAsync(body.refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            }),
        ).resolves.toMatchObject({ sub: user!.id, type: 'refresh' });
    });

    it('logs in an existing user by Google subject even when the ID token changes', async () => {
        const user = await userHelper.createUserSpec({
            email,
            role: UserRole.STUDENT,
            provider: 'google',
            userProviderId: googleId,
        });
        vi.spyOn(client, 'verifyIdToken').mockResolvedValue(verifiedTicket());

        for (const token of [idToken, 'renewed-google-id-token']) {
            const { body } = await request(app.getHttpServer())
                .post(path)
                .send({ idToken: token })
                .expect(HttpStatus.CREATED);

            await expect(
                jwt.verifyAsync(body.accessToken),
            ).resolves.toMatchObject({
                sub: user.id,
                type: 'access',
                role: UserRole.STUDENT,
            });
        }
    });

    it('returns 401 when Google rejects the ID token', async () => {
        vi.spyOn(client, 'verifyIdToken').mockRejectedValue(
            new Error('Invalid Google token'),
        );

        await request(app.getHttpServer())
            .post(path)
            .send({ idToken })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns 401 when the verified ticket has no payload', async () => {
        vi.spyOn(client, 'verifyIdToken').mockResolvedValue(new LoginTicket());

        await request(app.getHttpServer())
            .post(path)
            .send({ idToken })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it.each([{}, { idToken, role: UserRole.STUDENT }])(
        'returns 400 for invalid input %j before calling Google',
        async (input) => {
            const verifyIdToken = vi
                .spyOn(client, 'verifyIdToken')
                .mockRejectedValue(new Error('Unexpected verification call'));

            await request(app.getHttpServer())
                .post(path)
                .send(input)
                .expect(HttpStatus.BAD_REQUEST);

            expect(verifyIdToken).not.toHaveBeenCalled();
        },
    );
});
