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

    it('signs a token with the user ID and role for valid credentials', async () => {
        const token = await loginService.login(user.email, password);
        await expect(jwt.verifyAsync(token)).resolves.toMatchObject({
            sub: user.id,
            role: user.role,
        });
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
