import z from "zod";

export const missionSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    datetime: z.date({ message: "Datetime is required" }),
    price: z.string().regex(/^\d+(\.\d{1,2})?$/, { message: "Price must be a valid decimal number" }),
    location: z.string().min(1, { message: "Location is required" }),
});

export type MissionDto = z.infer<typeof missionSchema>;
