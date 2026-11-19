import z from 'zod';

const timeSchema = z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, {
        message: 'Time must use HH:mm format',
    });

const fields = z
    .object({
        studentId: z.number().int().positive(),
        dayOfWeek: z.number().int().min(1).max(7),
        startTime: timeSchema,
        endTime: timeSchema,
    })
    .strict();

function validTimeRange(data: {
    startTime?: string;
    endTime?: string;
}): boolean {
    if (data.startTime === undefined || data.endTime === undefined) return true;
    const seconds = (time: string) => {
        const [hours, minutes, seconds = 0] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    };
    return seconds(data.endTime) > seconds(data.startTime);
}

export const studentAvailabilityCreateSchema = fields.refine(validTimeRange, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export const studentAvailabilityRegistrationSchema = fields.omit({ studentId: true }).refine(validTimeRange, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export const studentAvailabilitySchema = studentAvailabilityCreateSchema;

export const studentAvailabilityUpdateSchema = fields
    .omit({ studentId: true })
    .partial()
    .strict()
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: 'At least one field must be provided for update',
        },
    )
    .refine(validTimeRange, {
        message: 'End time must be after start time',
        path: ['endTime'],
    });

export type StudentAvailabilityCreateDto = z.infer<typeof studentAvailabilityCreateSchema>;
export type StudentAvailabilityRegistrationDto = z.infer<typeof studentAvailabilityRegistrationSchema>;
export type StudentAvailabilityUpdateDto = z.infer<typeof studentAvailabilityUpdateSchema>;
