import { getTestingModule } from '../../../test/setup.js';
import { SkillService } from '../skill.service.js';
import { SkillSpecHelper } from './skill-spec-helper.js';

describe('SkillService', () => {
    let service: SkillService;
    let skillHelper: SkillSpecHelper;

    beforeAll(() => {
        service = getTestingModule().get(SkillService);
        skillHelper = new SkillSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.concurrent('should create and find a skill by id', async () => {
        const skill = await skillHelper.createSkillSpec({ name: 'TypeScript' });
        expect(await service.findOne(skill.id)).toMatchObject({
            id: skill.id,
            name: 'TypeScript',
        });
    });

    it.concurrent('should update a skill name', async () => {
        const skill = await skillHelper.createSkillSpec();
        expect(
            await service.update(skill.id, { name: 'PostgreSQL' }),
        ).toMatchObject({
            id: skill.id,
            name: 'PostgreSQL',
        });
        expect((await service.findOne(skill.id))?.name).toBe('PostgreSQL');
    });

    it.concurrent('should delete a skill and handle a missing id', async () => {
        const skill = await skillHelper.createSkillSpec();
        expect(await service.delete(skill.id)).toBe(true);
        expect(await service.findOne(skill.id)).toBeNull();
        expect(await service.update(skill.id, { name: 'SQL' })).toBeNull();
        expect(await service.delete(skill.id)).toBe(false);
    });
});
