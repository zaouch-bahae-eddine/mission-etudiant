import { studentSkillSchema } from '../dto/student-skill.dto.js';

describe('Student skill DTO', () => {
    const data = { studentId: 1, skillId: 2 };

    it('accepts both identifiers', () => {
        expect(studentSkillSchema.parse(data)).toEqual(data);
    });

    it.each([
        { studentId: undefined },
        { studentId: 0 },
        { skillId: undefined },
        { skillId: -1 },
        { skillId: 1.5 },
        { id: 3 },
    ])('rejects invalid data %j', (overrides) => {
        expect(
            studentSkillSchema.safeParse({ ...data, ...overrides }).success,
        ).toBe(false);
    });
});
