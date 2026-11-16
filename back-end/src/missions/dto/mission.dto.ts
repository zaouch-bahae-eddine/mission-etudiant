import z from 'zod';

export const missionSchema = z
    .object({
        title: z.string().min(1, { message: 'Title is required' }),
        description: z.string().min(1, { message: 'Description is required' }),
        datetime: z.date({ message: 'Datetime is required' }),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, {
            message: 'Price must be a valid decimal number',
        }),
        location: z.string().min(1, { message: 'Location is required' }),
        authorId: z
            .number()
            .int()
            .positive({ message: 'Author ID must be a positive integer' }),
    })
    .strict();

export const missionUpdateSchema = missionSchema
    .omit({ authorId: true })
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    });

export type MissionDto = z.infer<typeof missionSchema>;
export type MissionUpdateDto = z.infer<typeof missionUpdateSchema>;
