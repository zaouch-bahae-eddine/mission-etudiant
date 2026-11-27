import z from 'zod';
import { UserRole } from '../enums/user-role.enum.js';

export const userSchema = z
    .object({
        firstName: z.string().min(1, { message: 'First name is required' }),
        lastName: z.string().min(1, { message: 'Last name is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        password: z
            .string()
            .min(6, { message: 'Password must be at least 6 characters long' }),
        role: z.nativeEnum(UserRole, { message: 'Invalid user role' }),
        phone: z
            .string()
            .max(13, { message: 'Phone number is too long' })
            .optional(),
        city: z.string().min(2, { message: 'City is required' }).optional(),
        postalCode: z
            .string()
            .min(5, { message: 'Postal code is required' })
            .optional(),
        avatarKey: z.string().optional(),
        userProviderId: z.string().optional(),
        provider: z.string().optional(),
    })
    .strict();

export const UserUpdateSchema = userSchema
    .partial()
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update',
    });

export const userLoginSchema = z
    .object({
        email: z.string(),
        password: z.string(),
    })
    .strict();

export const userGoogleLoginSchema = z
    .object({
        idToken: z.string(),
    })
    .strict();

export type UserDto = z.infer<typeof userSchema>;
export type UserUpdateDto = z.infer<typeof UserUpdateSchema>;
export type UserLoginDto = z.infer<typeof userLoginSchema>;
export type UserGoogleLoginDto = z.infer<typeof userGoogleLoginSchema>;
