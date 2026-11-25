import { HttpStatus, type INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';
import type { User } from '../../users/user.model.js';
import { UsersService } from '../../users/users.service.js';
import { MissionsService } from '../../missions/missions.service.js';
import { MissionSpecHelper } from '../../missions/tests/mission-spec-helper.js';
import type { Mission } from '../../missions/mission.model.js';
import { getTestingModule } from '../../test/setup.js';

describe('AuthController and protected mission routes (HTTP)', () => {
    const path = '/auth/auth/login';
    const password = 'test-password';
    let user: User | undefined;
    let mission: Mission | undefined;
    let credentials: { email: string; password: string };
    let userHelper: UserSpecHelper;
    let missionHelper: MissionSpecHelper;
    let jwtService: JwtService;
    let app: INestApplication;

    beforeAll(async () => {
        const module = getTestingModule();
        userHelper = new UserSpecHelper();
        missionHelper = new MissionSpecHelper();
        jwtService = module.get(JwtService);
        app = module.createNestApplication();
        await app.init();
    });

    beforeEach(async () => {
        user = await userHelper.createUserSpec({ password });
        credentials = { email: user.email, password };
        mission = await missionHelper.createMissionSpec({ authorId: user.id });
    });

    afterEach(async () => {
        if (mission) {
            await getTestingModule().get(MissionsService).delete(mission.id);
            mission = undefined;
        }
        if (user) {
            await getTestingModule().get(UsersService).delete(user.id);
            user = undefined;
        }
    });

    it('returns a signed Bearer token for valid credentials', async () => {
        const response = await request(app.getHttpServer())
            .post(path)
            .send(credentials)
            .expect(HttpStatus.CREATED);

        expect(response.body.token).toMatch(/^Bearer \S+$/);
        await expect(
            jwtService.verifyAsync(response.body.token.slice('Bearer '.length)),
        ).resolves.toMatchObject({ sub: user?.id, role: user?.role });
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

    it('accepts the token returned by login on a protected mission route', async () => {
        const { body } = await request(app.getHttpServer())
            .post(path)
            .send(credentials)
            .expect(HttpStatus.CREATED);

        const response = await request(app.getHttpServer())
            .get('/mission')
            .query({ sortBy: 'id', sortOrder: 'DESC' })
            .set('Authorization', body.token)
            .expect(HttpStatus.OK);

        expect(response.body).toContainEqual(
            expect.objectContaining({ id: mission?.id, title: mission?.title }),
        );
    });

    it('returns 401 when a protected mission route has no token', async () => {
        await request(app.getHttpServer())
            .get('/mission')
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('returns 401 when a student attempts to delete a mission', async () => {
        const token = await jwtService.signAsync({ sub: user?.id, role: user?.role });

        await request(app.getHttpServer())
            .delete(`/mission/${mission?.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(HttpStatus.UNAUTHORIZED);
        await expect(
            getTestingModule().get(MissionsService).findOne(mission!.id),
        ).resolves.toMatchObject({ id: mission?.id });
    });
});
