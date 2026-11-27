import { UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MissionController } from '../../missions/mission.controller.js';
import { getTestingModule } from '../../test/setup.js';
import { UserRole } from '../../users/enums/user-role.enum.js';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';
import type { User } from '../../users/user.model.js';
import { UsersService } from '../../users/users.service.js';
import { Roles } from '../roles.decorator.js';
import { JwtAuthGuard } from '../jwtAuth.guard.js';

describe('JwtAuthGuard', () => {
    class TestController {
        @Roles([UserRole.STUDENT])
        studentRoute() {}

        @Roles([UserRole.CLIENT])
        clientRoute() {}
    }

    const { studentRoute, clientRoute } = TestController.prototype;
    let jwt: JwtService;
    let guard: JwtAuthGuard;
    let user: User;
    let userHelper: UserSpecHelper;
    let usersService: UsersService;

    function httpContext(
        handler: ReturnType<ExecutionContext['getHandler']>,
        authorization?: string,
    ) {
        const request: {
            headers: { authorization?: string };
            payload?: typeof user;
        } = {
            headers: authorization === undefined ? {} : { authorization },
        };
        const context = {
            getHandler: () => handler,
            switchToHttp: () => ({ getRequest: () => request }),
        } as ExecutionContext;
        return { context, request };
    }

    beforeAll(() => {
        const module = getTestingModule();
        jwt = module.get(JwtService);
        guard = module.get(JwtAuthGuard);
        usersService = module.get(UsersService);
        userHelper = new UserSpecHelper();
    });

    beforeEach(async () => {
        user = await userHelper.createUserSpec();
    });

    afterEach(async () => {
        if (user) await usersService.delete(user.id);
    });

    it('allows a handler without role metadata', async () => {
        const { context, request } = httpContext(
            MissionController.prototype.getAllMission,
        );
        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.payload).toBeUndefined();
    });

    it.each([undefined, '', 'Basic token', 'Bearer'])(
        'rejects a missing or malformed authorization header (%s)',
        async (header) => {
            await expect(
                guard.canActivate(httpContext(studentRoute, header).context),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        },
    );

    it('rejects invalid and expired tokens', async () => {
        const expired = await jwt.signAsync(
            { sub: user.id, type: 'access', role: user.role },
            { expiresIn: -1 },
        );

        for (const token of ['invalid-token', expired]) {
            await expect(
                guard.canActivate(
                    httpContext(studentRoute, `Bearer ${token}`).context,
                ),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        }
    });

    it('attaches the user to the request for an allowed role', async () => {
        const token = await jwt.signAsync({
            sub: user.id,
            type: 'access',
            role: user.role,
        });
        const { context, request } = httpContext(
            studentRoute,
            `Bearer ${token}`,
        );

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(request.payload).toMatchObject({
            id: user.id,
            email: user.email,
            role: user.role,
        });
    });

    it.each([UserRole.STUDENT, 'admin'])(
        'rejects a token with role %s on a client-only handler',
        async (role) => {
            const token = await jwt.signAsync({
                sub: user.id,
                type: 'access',
                role,
            });

            await expect(
                guard.canActivate(
                    httpContext(clientRoute, 'Bearer ' + token).context,
                ),
            ).rejects.toBeInstanceOf(UnauthorizedException);
        },
    );
});
