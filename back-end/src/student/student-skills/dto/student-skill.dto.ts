import z from 'zod';

export const studentSkillSchema = z
    .object({
        studentId: z.number().int().positive(),
        skillId: z.number().int().positive(),
    })
    .strict();

export const studentSkillCreateSchema = studentSkillSchema
    .pick({ skillId: true })
    .strict();

export type StudentSkillDto = z.infer<typeof studentSkillSchema>;
export type StudentSkillCreateDto = z.infer<typeof studentSkillCreateSchema>;
