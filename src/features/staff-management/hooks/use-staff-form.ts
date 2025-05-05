import { useForm, UseFormReturn } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ZodError } from 'zod';
import { useCallback } from 'react';

import { createStaff, updateStaff } from '../api/api';
import { Staff as StaffType } from '../types/types';
import {
    StaffFormValues,
    defaultStaffFormValues,
    addStaffValidationSchema,
    updateStaffValidationSchema,
} from '../schema/schema';

// Type Definitions (matching those in staff-context)
type ActionType = 'add' | 'edit' | null;

interface UseStaffFormProps {
    actionType: ActionType;
    currentRow: StaffType | null;
    onSuccess?: () => void; // Optional callback for successful submission
}

interface UseStaffFormReturn {
    form: UseFormReturn<StaffFormValues>;
    isSubmitting: boolean;
    handleFormSubmit: (data: StaffFormValues) => Promise<void>;
    mapStaffToFormValues: (staff: StaffType) => StaffFormValues;
}

/**
 * Custom hook to manage the staff form state, validation, and submission logic.
 */
export function useStaffForm({
    actionType,
    currentRow,
    onSuccess, // Callback to run on mutation success (e.g., close drawer)
}: UseStaffFormProps): UseStaffFormReturn {
    const queryClient = useQueryClient();
    const form = useForm<StaffFormValues>({
        mode: 'onChange',
        defaultValues: defaultStaffFormValues,
    });

    // --- API Mutations ---

    const { mutateAsync: createMutate, isPending: isCreating } = useMutation<unknown, Error, StaffFormValues>({
        mutationFn: createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            toast.success('Staff member created successfully');
            onSuccess?.(); // Call the success callback
        },
        onError: (error) => {
            toast.error(`Failed to create staff member: ${error.message}`);
        },
    });

    const { mutateAsync: updateMutate, isPending: isUpdating } = useMutation<
        unknown,
        Error,
        { id: string; data: StaffFormValues }
    >({
        mutationFn: ({ id, data }) => updateStaff(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            toast.success('Staff member updated successfully');
            onSuccess?.(); // Call the success callback
        },
        onError: (error) => {
            toast.error(`Failed to update staff member: ${error.message}`);
        },
    });

    // --- Loading State ---
    const isSubmitting = isCreating || isUpdating;

    // --- Helper Functions ---

    const handleValidationErrors = (error: ZodError<StaffFormValues>) => {
        console.error('Validation Failed:', error.flatten());
        error.errors.forEach((err) => {
            if (err.path.length > 0 && err.path[0] in defaultStaffFormValues) {
                const fieldName = err.path[0] as keyof StaffFormValues;
                form.setError(fieldName, {
                    type: 'manual',
                    message: err.message,
                });
            }
        });
    };

    const handleFormSubmit = async (formData: StaffFormValues) => {
        form.clearErrors();

        try {
            if (actionType === 'edit' && currentRow) {
                const result = updateStaffValidationSchema.safeParse(formData);
                if (!result.success) {
                    handleValidationErrors(result.error);
                    return;
                }
                const validatedData = result.data;
                const { password, ...updatePayload } = validatedData;
                const payload = { ...updatePayload, is_active: validatedData.is_active };
                await updateMutate({ id: String(currentRow.id), data: payload as StaffFormValues });
            } else if (actionType === 'add') {
                const result = addStaffValidationSchema.safeParse(formData);
                if (!result.success) {
                    handleValidationErrors(result.error);
                    return;
                }
                const validatedData = result.data;
                const payload = { ...validatedData, is_active: validatedData.is_active ?? true };
                await createMutate(payload as StaffFormValues);
            } else {
                console.error('Form submitted with invalid action type:', actionType);
                toast.error('Invalid action. Please try again.');
            }
        } catch (error) {
            // API call errors are handled by the individual mutation's onError callbacks.
            console.error('Error during form submission process:', error);
            // toast.error('An unexpected error occurred during submission.'); // Already handled by mutation
        }
    };

    const mapStaffToFormValues = useCallback((staff: StaffType): StaffFormValues => {
        return {
            first_name: staff.first_name,
            last_name: staff.last_name,
            email: staff.email,
            password: '',
            groups: staff.groups,
            is_active: staff.is_active,
            profile_photo: staff.profile_photo ?? undefined,
        };
    }, []);

    return {
        form,
        isSubmitting,
        handleFormSubmit,
        mapStaffToFormValues,
    };
}
