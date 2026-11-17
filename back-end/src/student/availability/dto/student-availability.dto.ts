import z from 'zod';

const timeSchema = z
    .string()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,6})?)?$/, {
        message: 'Time must use HH:mm or HH:mm:ss format',
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

export const studentAvailabilitySchema = fields.refine(validTimeRange, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export const studentAvailabilityUpdateSchema = fields
    .omit({ studentId: true })
    .partial()
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

export type StudentAvailabilityDto = z.infer<typeof studentAvailabilitySchema>;
export type StudentAvailabilityUpdateDto = z.infer<
    typeof studentAvailabilityUpdateSchema
>;
