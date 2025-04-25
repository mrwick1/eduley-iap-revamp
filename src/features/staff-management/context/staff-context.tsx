import React, { useState } from 'react';
import { Staff } from '../schema/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const staffFormSchema = z.object({
    first_name: z.string().min(2, { message: 'Min 2 characters' }).max(30, { message: 'Max 30 characters' }),
    last_name: z.string().min(1, { message: 'Min 1 characters' }).max(30, { message: 'Max 30 characters' }),
    email: z.string({ required_error: 'Email required' }).email({ message: 'Please enter a valid email address' }),
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
                    'Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, or special characters (!@#$%^&*)',
            },
        ),
    profile_photo: z.union([z.string(), z.instanceof(File)]).optional(),
    groups: z.array(z.number()).min(1, { message: 'Select at least one role' }),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffContextType {
    // Current row state
    currentRow: Staff | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<Staff | null>>;
    setOpen: (action: 'update' | 'delete') => void;

    // Form state
    form: ReturnType<typeof useForm<StaffFormValues>>;
    isSubmitting: boolean;
    handleFormSubmit: (data: StaffFormValues) => Promise<void>;
    resetForm: () => void;
}

const StaffContext = React.createContext<StaffContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export default function StaffProvider({ children }: Props) {
    const [currentRow, setCurrentRow] = useState<Staff | null>(null);
    const [, setOpenAction] = useState<'update' | 'delete' | null>(null);

    const form = useForm<StaffFormValues>({
        resolver: zodResolver(staffFormSchema),
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            profile_photo: undefined,
            groups: [],
        },
    });

    const { mutateAsync, isPending: isSubmitting } = useMutation({
        mutationFn: async (data: StaffFormValues) => {
            // TODO: Implement staff creation API
            console.log('Creating staff with data:', data);
            return Promise.resolve();
        },
    });

    const handleFormSubmit = async (data: StaffFormValues) => {
        try {
            await mutateAsync(data);
            toast.success('Staff member created successfully');
            resetForm();
        } catch (error) {
            toast.error('Failed to create staff member');
        }
    };

    const resetForm = () => {
        form.reset();
    };

    const value = {
        currentRow,
        setCurrentRow,
        setOpen: setOpenAction,
        form,
        isSubmitting,
        handleFormSubmit,
        resetForm,
    };

    return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export const useStaff = () => {
    const staffContext = React.useContext(StaffContext);

    if (!staffContext) {
        throw new Error('useStaff has to be used within <StaffProvider>');
    }

    return staffContext;
};
