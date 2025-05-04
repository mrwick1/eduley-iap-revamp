import React, { useState, useEffect, useCallback } from 'react';
import {
    StaffFormValues,
    defaultStaffFormValues,
    addStaffValidationSchema,
    updateStaffValidationSchema,
} from '../schema/schema';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createStaff, updateStaff, deleteStaff, updateStaffStatus } from '../api/api';
import { queryClient } from '@/lib/api-client';
import { Staff as StaffType } from '../types/types';
import { ZodError } from 'zod';

type ActionType = 'add' | 'edit' | null;
type ConfirmActionType = 'delete' | 'activate' | 'deactivate' | null;

interface StaffContextType {
    currentRow: StaffType | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<StaffType | null>>;
    actionType: ActionType;
    setActionType: React.Dispatch<React.SetStateAction<ActionType>>;

    // Form state
    form: UseFormReturn<StaffFormValues>;
    isSubmitting: boolean;
    handleFormSubmit: (data: StaffFormValues) => Promise<void>;

    // Drawer state
    isDrawerOpen: boolean;
    setIsDrawerOpen: (value: boolean) => void;
    openDrawerForAction: (action: 'add' | 'edit', staff?: StaffType) => void;

    // Confirmation Dialog State
    isConfirmOpen: boolean;
    confirmActionType: ConfirmActionType;
    targetStaffId: string | null;
    isConfirmLoading: boolean;
    handleOpenDeleteConfirm: (id: string) => void;
    handleOpenActivateConfirm: (id: string) => void;
    handleOpenDeactivateConfirm: (id: string) => void;
    handleConfirmAction: () => void;
    handleCloseConfirm: () => void;
}

const StaffContext = React.createContext<StaffContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export default function StaffProvider({ children }: Props) {
    const [currentRow, setCurrentRow] = useState<StaffType | null>(null);
    const [actionType, setActionType] = useState<ActionType>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Confirmation Dialog State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmActionType, setConfirmActionType] = useState<ConfirmActionType>(null);
    const [targetStaffId, setTargetStaffId] = useState<string | null>(null);

    const form = useForm<StaffFormValues>({
        mode: 'onChange',
        defaultValues: defaultStaffFormValues,
    });

    const { mutateAsync: createMutate, isPending: isCreating } = useMutation<unknown, Error, StaffFormValues>({
        mutationFn: createStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            setIsDrawerOpen(false);
            toast.success('Staff member created successfully');
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
            setIsDrawerOpen(false);
            toast.success('Staff member updated successfully');
        },
        onError: (error) => {
            toast.error(`Failed to update staff member: ${error.message}`);
        },
    });

    const { mutateAsync: deleteMutate, isPending: isDeleting } = useMutation<unknown, Error, string>({
        mutationFn: deleteStaff,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            handleCloseConfirm();
            toast.success('Staff member deleted successfully');
        },
        onError: (error) => {
            toast.error(`Failed to delete staff member: ${error.message}`);
        },
    });

    const { mutateAsync: updateStatusMutate, isPending: isUpdatingStatus } = useMutation<
        unknown,
        Error,
        { id: string; isActive: boolean }
    >({
        mutationFn: ({ id, isActive }) => updateStaffStatus(id, isActive),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            handleCloseConfirm();
            toast.success(`Staff member ${variables.isActive ? 'activated' : 'deactivated'} successfully`);
        },
        onError: (error, variables) => {
            toast.error(`Failed to ${variables.isActive ? 'activate' : 'deactivate'} staff member: ${error.message}`);
        },
    });

    const isSubmitting = isCreating || isUpdating;
    const isConfirmLoading = isDeleting || isUpdatingStatus;

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

    const openDrawerForAction = useCallback(
        (action: 'add' | 'edit', staff?: StaffType) => {
            setActionType(action);
            form.clearErrors();
            if (action === 'edit' && staff) {
                setCurrentRow(staff);
                const formValues = mapStaffToFormValues(staff);
                form.reset(formValues);
            } else {
                setCurrentRow(null);
                form.reset(defaultStaffFormValues);
            }
            setIsDrawerOpen(true);
        },
        [form, mapStaffToFormValues],
    );

    // --- Confirmation Dialog Handlers ---
    const openConfirmDialog = (action: ConfirmActionType, id: string) => {
        setConfirmActionType(action);
        setTargetStaffId(id);
        setIsConfirmOpen(true);
    };

    const handleOpenDeleteConfirm = (id: string) => {
        openConfirmDialog('delete', id);
    };

    const handleOpenActivateConfirm = (id: string) => {
        openConfirmDialog('activate', id);
    };

    const handleOpenDeactivateConfirm = (id: string) => {
        openConfirmDialog('deactivate', id);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
        setConfirmActionType(null);
        setTargetStaffId(null);
    };

    const handleConfirmAction = async () => {
        if (!targetStaffId || !confirmActionType) return;

        try {
            if (confirmActionType === 'delete') {
                await deleteMutate(targetStaffId);
            } else if (confirmActionType === 'activate') {
                await updateStatusMutate({ id: targetStaffId, isActive: true });
            } else if (confirmActionType === 'deactivate') {
                await updateStatusMutate({ id: targetStaffId, isActive: false });
            }
        } catch (error) {
            // Errors are handled in the mutation's onError callback
            console.error(`Failed to ${confirmActionType} staff member:`, error);
        }
    };

    useEffect(() => {
        if (!isDrawerOpen) {
            setCurrentRow(null);
            setActionType(null);
            form.clearErrors();
            if (!isSubmitting) {
                form.reset(defaultStaffFormValues);
            }
        }
    }, [isDrawerOpen, form, isSubmitting]);

    const value = {
        currentRow,
        setCurrentRow,
        actionType,
        setActionType,
        form,
        isSubmitting,
        handleFormSubmit,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawerForAction,
        // Confirm Dialog exports
        isConfirmOpen,
        confirmActionType,
        targetStaffId,
        isConfirmLoading,
        handleOpenDeleteConfirm,
        handleOpenActivateConfirm,
        handleOpenDeactivateConfirm,
        handleConfirmAction,
        handleCloseConfirm,
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
