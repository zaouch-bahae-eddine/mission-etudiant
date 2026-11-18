import z from "zod";
import { UserSchema } from "../../users/dto/user.dto.js";
import { studentProfileSchema } from "../profile/dto/student-profile.dto.js";
import { studentAvailabilitySchema } from "../availability/dto/student-availability.dto.js";
import { studentSkillSchema } from "../student-skills/dto/student-skill.dto.js";

export const studentSchemaDto = z.object({
    user: UserSchema,
    profile: studentProfileSchema.partial({ userId: true }),
    availability: z.array(studentAvailabilitySchema.partial({ studentId: true })),
    skills: z.array(studentSkillSchema.partial({ studentId: true })),
});

export type StudentSchemaDto = z.infer<typeof studentSchemaDto>;