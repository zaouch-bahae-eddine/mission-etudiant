import { skillSchema, skillUpdateSchema } from '../dto/skill.dto.js';

describe('Skill DTOs', () => {
    describe.each([skillSchema, skillUpdateSchema])(
        'skill name schema',
        (schema) => {
            it('accepts a valid name', () => {
                expect(schema.parse({ name: 'TypeScript' })).toEqual({
                    name: 'TypeScript',
                });
            });

            it.each([
                {},
                { name: null },
                { name: 42 },
                { name: 'a'.repeat(256) },
                { id: 1, name: 'TypeScript' },
            ])('rejects invalid data %j', (data) => {
                expect(schema.safeParse(data).success).toBe(false);
            });
        },
    );
});
