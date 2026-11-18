import z from 'zod';

export const studentSkillSchema = z
    .object({
        studentId: z.number().int().positive(),
        skillId: z.number().int().positive(),
    })
    .strict();

export type StudentSkillDto = z.infer<typeof studentSkillSchema>;
