import { HttpStatus, type INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';
import type { User } from '../../users/user.model.js';
import { UserRole } from '../../users/enums/user-role.enum.js';
import { UsersService } from '../../users/users.service.js';
import { getTestingModule } from '../../test/setup.js';

describe('AuthController (HTTP)', () => {
    const path = '/auth/login';
    const refreshPath = '/auth/refresh';
    const password = 'test-password';
    let user: User | undefined;
    let credentials: { email: string; password: string };
    let userHelper: UserSpecHelper;
    let jwtService: JwtService;
    let app: INestApplication;

    beforeAll(async () => {
        const module = getTestingModule();
        userHelper = new UserSpecHelper();
        jwtService = module.get(JwtService);
        app = module.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        user = await userHelper.createUserSpec({ password });
        credentials = { email: user.email, password };
    });

    afterEach(async () => {
        if (user) {
            await getTestingModule().get(UsersService).delete(user.id);
            user = undefined;
        }
    });

    it('returns an access token and a refresh token for valid credentials', async () => {
        const response = await request(app.getHttpServer())
            .post(path)
            .send(credentials)
            .expect(HttpStatus.CREATED);

        expect(response.body).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
        });
        await expect(
            jwtService.verifyAsync(response.body.accessToken),
        ).resolves.toMatchObject({
            sub: user?.id,
            type: 'access',
            role: user?.role,
        });
    });

    it('returns 403 for an incorrect password', async () => {
        await request(app.getHttpServer())
            .post(path)
            .send({ ...credentials, password: 'wrong-password' })
            .expect(HttpStatus.FORBIDDEN)
            .expect({ msg: 'Login or password incorrect', errCode: 403 });
    });

    it('returns 400 when the password is missing', async () => {
        await request(app.getHttpServer())
            .post(path)
            .send({ email: credentials.email })
            .expect(HttpStatus.BAD_REQUEST);
    });

    it('returns a signed access token from the refresh token issued at login', async () => {
        const login = await request(app.getHttpServer())
            .post(path)
            .send(credentials)
            .expect(HttpStatus.CREATED);

        const { body } = await request(app.getHttpServer())
            .post(refreshPath)
            .send({ refreshToken: login.body.refreshToken })
            .expect(HttpStatus.CREATED);

        expect(body).toEqual({ accessToken: expect.any(String) });
        const payload = await jwtService.verifyAsync(body.accessToken);
        expect(payload).toMatchObject({ sub: user?.id, type: 'access' });
        expect(payload.exp - payload.iat).toBe(15 * 60);
    });

    it.each([{}, { refreshToken: 'invalid-token' }])(
        'returns 401 when the refresh request contains %j',
        async (input) => {
            await request(app.getHttpServer())
                .post(refreshPath)
                .send(input)
                .expect(HttpStatus.UNAUTHORIZED);
        },
    );

    it('returns 401 when an access token is sent to the refresh route', async () => {
        const { body } = await request(app.getHttpServer())
            .post(path)
            .send(credentials)
            .expect(HttpStatus.CREATED);

        await request(app.getHttpServer())
            .post(refreshPath)
            .send({ refreshToken: body.accessToken })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns 401 when the refresh token has expired', async () => {
        const refreshToken = await jwtService.signAsync(
            { sub: user?.id, type: 'refresh' },
            { secret: process.env.JWT_REFRESH_SECRET, expiresIn: -1 },
        );

        await request(app.getHttpServer())
            .post(refreshPath)
            .send({ refreshToken })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('registers a client without address fields', async () => {
        const email = 'registered-' + credentials.email;
        const avatarKey = 'avatars/camille.png';
        const usersService = getTestingModule().get(UsersService);

        try {
            const { body } = await request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    firstName: 'Camille',
                    lastName: 'Martin',
                    email,
                    password,
                    role: UserRole.CLIENT,
                    avatarKey,
                })
                .expect(HttpStatus.CREATED);

            expect(body).toMatchObject({
                email,
                role: UserRole.CLIENT,
                avatarKey,
                city: null,
                postalCode: null,
            });
            expect(body).not.toHaveProperty('passwordHash');
            expect(body).not.toHaveProperty('password');
        } finally {
            const registered = await usersService.findByEmail(email);
            if (registered) await usersService.delete(registered.id);
        }
    });
});
