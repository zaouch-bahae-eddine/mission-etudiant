import z from 'zod';

export const skillSchema = z.object({ name: z.string().max(255) }).strict();
export const skillUpdateSchema = skillSchema;

export type SkillDto = z.infer<typeof skillSchema>;
export type SkillUpdateDto = z.infer<typeof skillUpdateSchema>;
