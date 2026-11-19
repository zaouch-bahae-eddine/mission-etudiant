import z from 'zod';

export const studentProfileSchema = z
    .object({
        userId: z.number().int().positive(),
        bio: z.string().nullable().optional(),
        university: z.string().max(255).nullable().optional(),
        studentField: z.string().max(255).nullable().optional(),
        studentLevel: z.string().max(100).nullable().optional(),
        hasDrivingLicense: z.boolean().nullable().optional(),
        hasVehicle: z.boolean().nullable().optional(),
        travel_radius_km: z.number().int().nonnegative().nullable().optional(),
        hourly_rate: z
            .number()
            .nonnegative()
            .max(99999999.99)
            .refine(
                (value) =>
                    Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
                {
                    message: 'Hourly rate must have at most two decimal places',
                },
            )
            .nullable()
            .optional(),
        experience: z.string().nullable().optional(),
        isAvailable: z.boolean().nullable().optional(),
    })
    .strict();

export const studentProfileRegistrationSchema = studentProfileSchema.omit({
    userId: true,
});

export const studentProfileUpdateSchema = studentProfileSchema
    .partial()
    .required({ userId: true })
    .refine(
        (data) => Object.values(data).some((value) => value !== undefined),
        {
            message: 'At least one field must be provided for update',
        },
    );

export type StudentProfileDto = z.infer<typeof studentProfileSchema>;
export type StudentProfileRegistrationDto = z.infer<
    typeof studentProfileRegistrationSchema
>;
export type StudentProfileUpdateDto = z.infer<
    typeof studentProfileUpdateSchema
>;
