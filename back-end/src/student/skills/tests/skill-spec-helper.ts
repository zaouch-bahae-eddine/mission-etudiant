import { faker } from '@faker-js/faker';
import { getTestingModule } from '../../../test/setup.js';
import { type SkillDto } from '../dto/skill.dto.js';
import { SkillService } from '../skill.service.js';

export class SkillSpecHelper {
    service = getTestingModule().get(SkillService);

    createSkillSpec(overrides: Partial<SkillDto> = {}) {
        return this.service.create({
            name: faker.person.jobArea(),
            ...overrides,
        });
    }
}
