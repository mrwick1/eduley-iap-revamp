import { z } from 'zod';

// --- Base schema parts --- (Optional, but can help reduce duplication)
const baseStaffInfoSchema = {
    first_name: z.string().min(2, { message: 'Min 2 characters' }).max(30, { message: 'Max 30 characters' }),
    last_name: z.string().min(1, { message: 'Min 1 characters' }).max(30, { message: 'Max 30 characters' }),
    email: z.string({ required_error: 'Email required' }).email({ message: 'Please enter a valid email address' }),
    profile_photo: z.union([z.instanceof(File), z.string()]).optional(),
    groups: z.array(z.number()).min(1, { message: 'Please select at least one role' }),
};

// --- Schema for Form State Management (used in useForm) ---
export const staffFormSchema = z.object({
    ...baseStaffInfoSchema,
    password: z.string().optional(), // Optional for base form state
    is_active: z.boolean().optional(), // Optional for base form state
});

// --- Type for Form State ---
export type StaffFormValues = z.infer<typeof staffFormSchema>;

// --- Default values aligning with StaffFormValues ---
export const defaultStaffFormValues: StaffFormValues = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_photo: undefined,
    groups: [],
    is_active: true, // Default true in the form
};

// --- Schema for ADD Validation (used in onSubmit) ---
export const addStaffValidationSchema = z.object({
    ...baseStaffInfoSchema,
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .refine(
            (password) => {
                const hasLowerCase = /[a-z]/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSpecialChars = /[!@#$%^&*]/.test(password);
                const conditionsMet = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
                return conditionsMet >= 3;
            },
            {
                message:
                    'Password must contain at least 3 of: lowercase, uppercase, numbers, or special characters (!@#$%^&*)',
            },
        ),
    is_active: z.boolean().optional(), // Optional as it's often defaulted server-side
});

// --- Schema for UPDATE Validation (used in onSubmit) ---
export const updateStaffValidationSchema = z.object({
    ...baseStaffInfoSchema,
    password: z
        .string()
        .optional()
        .refine(
            (password) => {
                if (password === undefined || password === '') return true;
                if (password.length < 8) return false;
                const hasLowerCase = /[a-z]/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const hasNumbers = /[0-9]/.test(password);
                const hasSpecialChars = /[!@#$%^&*]/.test(password);
                const conditionsMet = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
                return conditionsMet >= 3;
            },
            {
                message: 'Password must be empty, or at least 8 characters with 3 complexities (!@#$%^&*)',
            },
        ),
    is_active: z.boolean(), // Required for update validation
});

// Original full staff schema (if needed elsewhere)
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

// Remove the previous staffFormSchema used for the resolver
// export const staffFormSchema = z.object({ ... });
