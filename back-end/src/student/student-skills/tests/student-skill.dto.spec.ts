import {
    studentSkillCreateSchema,
    studentSkillSchema,
} from '../dto/student-skill.dto.js';

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

    it('accepts a skill ID for student-scoped creation', () => {
        expect(studentSkillCreateSchema.parse({ skillId: 2 })).toEqual({
            skillId: 2,
        });
    });

    it.each([{ skillId: 0 }, { skillId: 1.5 }, { skillId: 2, studentId: 1 }])(
        'rejects invalid student-scoped creation data %j',
        (input) => {
            expect(studentSkillCreateSchema.safeParse(input).success).toBe(
                false,
            );
        },
    );
});
