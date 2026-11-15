import z from "zod";
import { UserRole } from "../enums/user-role.enum.js";

export const UserSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    role: z.nativeEnum(UserRole, { message: "Invalid user role" }),
});

export type UserDto = z.infer<typeof UserSchema>;