import { z } from 'zod';

export const staffSchema = z.object({
    id: z.number(),
    institute: z.number(),
    email: z.string(),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_photo: z.string().nullable(),
    groups: z.array(z.number()),
    is_active: z.boolean(),
    instructor_id: z.number().nullable(),
});

export type Staff = z.infer<typeof staffSchema>;
