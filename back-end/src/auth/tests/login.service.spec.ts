import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { getTestingModule } from '../../test/setup.js';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';
import type { User } from '../../users/user.model.js';
import { UsersService } from '../../users/users.service.js';
import { LoginService } from '../login.service.js';

describe('LoginService', () => {
    const password = 'test-password';
    let user: User;
    let userHelper: UserSpecHelper;
    let usersService: UsersService;
    let jwt: JwtService;
    let loginService: LoginService;

    beforeAll(() => {
        const module = getTestingModule();
        jwt = module.get(JwtService);
        loginService = module.get(LoginService);
        usersService = module.get(UsersService);
        userHelper = new UserSpecHelper();
    });

    beforeEach(async () => {
        user = await userHelper.createUserSpec({ password });
    });

    afterEach(async () => {
        if (user) await usersService.delete(user.id);
    });

    it('signs an access token with the user ID and role for 15 minutes', async () => {
        const { accessToken } = await loginService.login(user.email, password);
        const payload = await jwt.verifyAsync(accessToken);

        expect(payload).toMatchObject({
            sub: user.id,
            type: 'access',
            role: user.role,
        });
        expect(payload.exp - payload.iat).toBe(15 * 60);
    });

    it('signs a refresh token with the refresh secret for 7 days', async () => {
        const { accessToken, refreshToken } = await loginService.login(
            user.email,
            password,
        );
        const secret = process.env.JWT_REFRESH_SECRET;
        expect(secret).toBeTruthy();
        const payload = await jwt.verifyAsync(refreshToken, { secret });

        expect(payload).toEqual({
            sub: user.id,
            type: 'refresh',
            iat: expect.any(Number),
            exp: expect.any(Number),
        });
        expect(payload.exp - payload.iat).toBe(7 * 24 * 60 * 60);
        await expect(jwt.verifyAsync(refreshToken)).rejects.toThrow(
            'invalid signature',
        );
        await expect(jwt.verifyAsync(accessToken, { secret })).rejects.toThrow(
            'invalid signature',
        );
    });

    it.each([
        ['unknown email', password],
        ['incorrect password', 'wrong-password'],
    ])('rejects an %s without signing a token', async (scenario, input) => {
        const email =
            scenario === 'unknown email'
                ? `${randomUUID()}@example.com`
                : user.email;
        await expect(loginService.login(email, input)).rejects.toMatchObject({
            status: HttpStatus.FORBIDDEN,
            response: { msg: 'Login or password incorrect', errCode: 403 },
        });
    });
});
