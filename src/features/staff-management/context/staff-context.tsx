import React, { useState, useEffect, useCallback } from 'react';
import { defaultStaffFormValues } from '../schema/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { deleteStaff, updateStaffStatus } from '../api/api';
import { Staff as StaffType } from '../types/types';
import { useStaffForm } from '../hooks/use-staff-form';
import { StaffFormValues } from '../schema/schema';
import { UseFormReturn } from 'react-hook-form';

// --- Type Definitions ---

/** Action type for the main drawer (add or edit staff). */
type ActionType = 'add' | 'edit' | null;
/** Action type for the confirmation dialog (delete, activate, deactivate). */
type ConfirmActionType = 'delete' | 'activate' | 'deactivate' | null;

/** Defines the shape of the Staff Context. */
interface StaffContextType {
    // --- State for the currently selected row ---
    currentRow: StaffType | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<StaffType | null>>;
    actionType: ActionType;
    setActionType: React.Dispatch<React.SetStateAction<ActionType>>;

    form: UseFormReturn<StaffFormValues>;
    isSubmitting: boolean;
    handleFormSubmit: (data: StaffFormValues) => Promise<void>;

    // --- Drawer state ---
    isDrawerOpen: boolean;
    setIsDrawerOpen: (value: boolean) => void;
    openDrawerForAction: (action: 'add' | 'edit', staff?: StaffType) => void;

    // --- Confirmation Dialog State ---
    isConfirmOpen: boolean;
    confirmActionType: ConfirmActionType;
    targetStaffId: string | null;
    targetStaffGroups: number[] | null;
    isConfirmLoading: boolean;
    handleOpenDeleteConfirm: (id: string) => void;
    handleOpenActivateConfirm: (id: string, groups: number[]) => void;
    handleOpenDeactivateConfirm: (id: string, groups: number[]) => void;
    handleConfirmAction: () => void;
    handleCloseConfirm: () => void;
}

// --- Context Definition ---

/** Context for managing staff-related state and actions. */
const StaffContext = React.createContext<StaffContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

// --- Provider Component ---

/**
 * Provides staff management state and actions to its children.
 * Manages form state, drawer visibility, confirmation dialogs, and API mutations.
 */
export default function StaffProvider({ children }: Props) {
    // --- State Hooks ---
    const [currentRow, setCurrentRow] = useState<StaffType | null>(null);
    const [actionType, setActionType] = useState<ActionType>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // --- Confirmation Dialog State ---
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmActionType, setConfirmActionType] = useState<ConfirmActionType>(null);
    const [targetStaffId, setTargetStaffId] = useState<string | null>(null);
    const [targetStaffGroups, setTargetStaffGroups] = useState<number[] | null>(null);

    // --- React Query Client ---
    const queryClient = useQueryClient();

    // --- Use the custom form hook ---
    const { form, isSubmitting, handleFormSubmit, mapStaffToFormValues } = useStaffForm({
        actionType,
        currentRow,
        onSuccess: () => {
            setIsDrawerOpen(false);
        },
    });

    // --- API Mutations (Delete/Status Update) ---

    /** Mutation for deleting a staff member. */
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

    /** Mutation for updating a staff member's status (active/inactive) and groups. */
    const { mutateAsync: updateStatusMutate, isPending: isUpdatingStatus } = useMutation<
        unknown,
        Error,
        { id: string; data: { is_active: boolean; groups: number[] } }
    >({
        mutationFn: ({ id, data }) => updateStaffStatus(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['staff'] });
            toast.success(`Staff member ${variables.data.is_active ? 'activated' : 'deactivated'} successfully`);
            handleCloseConfirm();
        },
        onError: (error, variables) => {
            toast.error(
                `Failed to ${variables.data.is_active ? 'activate' : 'deactivate'} staff member: ${error.message}`,
            );
        },
    });

    // --- Loading States ---
    /** Combined loading state for delete and status update mutations (confirmation dialog actions). */
    const isConfirmLoading = isDeleting || isUpdatingStatus;

    // --- Helper Functions ---

    /**
     * Opens the add/edit drawer, sets the action type, and initializes the form.
     * Resets the form with default values for 'add' or populates it with existing data for 'edit'.
     * @param action - The action type ('add' or 'edit').
     * @param staff - Optional staff data for editing.
     */
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

    /**
     * Opens the confirmation dialog with the specified action type and target ID.
     * Optionally stores target groups for activate/deactivate actions.
     * @param action - The confirmation action type.
     * @param id - The ID of the target staff member.
     * @param groups - Optional array of group IDs (for activate/deactivate).
     */
    const openConfirmDialog = (action: ConfirmActionType, id: string, groups?: number[]) => {
        setConfirmActionType(action);
        setTargetStaffId(id);
        if (groups !== undefined) {
            setTargetStaffGroups(groups);
        } else {
            setTargetStaffGroups(null);
        }
        setIsConfirmOpen(true);
    };

    /** Convenience handler to open the delete confirmation dialog. */
    const handleOpenDeleteConfirm = (id: string) => {
        openConfirmDialog('delete', id);
    };

    /** Convenience handler to open the activate confirmation dialog. */
    const handleOpenActivateConfirm = (id: string, groups: number[]) => {
        openConfirmDialog('activate', id, groups);
    };

    /** Convenience handler to open the deactivate confirmation dialog. */
    const handleOpenDeactivateConfirm = (id: string, groups: number[]) => {
        openConfirmDialog('deactivate', id, groups);
    };

    /** Closes the confirmation dialog and resets related state. */
    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
        setConfirmActionType(null);
        setTargetStaffId(null);
        setTargetStaffGroups(null);
    };

    /**
     * Executes the confirmed action (delete, activate, deactivate) based on the state.
     * Calls the appropriate mutation.
     */
    const handleConfirmAction = async () => {
        if (!targetStaffId || !confirmActionType) {
            console.warn('Attempted confirm action without target ID or action type.');
            return;
        }

        try {
            switch (confirmActionType) {
                case 'delete':
                    await deleteMutate(targetStaffId);
                    break;
                case 'activate':
                    if (targetStaffGroups === null) {
                        console.error('Groups not available for activation');
                        toast.error('Cannot activate staff: Group information missing.');
                        handleCloseConfirm();
                        return;
                    }
                    await updateStatusMutate({
                        id: targetStaffId,
                        data: { is_active: true, groups: targetStaffGroups },
                    });
                    break;
                case 'deactivate':
                    if (targetStaffGroups === null) {
                        console.error('Groups not available for deactivation');
                        toast.error('Cannot deactivate staff: Group information missing.');
                        handleCloseConfirm();
                        return;
                    }
                    await updateStatusMutate({
                        id: targetStaffId,
                        data: { is_active: false, groups: targetStaffGroups },
                    });
                    break;
                default:
                    console.warn('Unknown confirm action type:', confirmActionType);
                    handleCloseConfirm();
            }
        } catch (error) {
            console.error(`Failed to ${confirmActionType} staff member during confirmation:`, error);
        }
    };

    // --- Effects ---

    /**
     * Effect to reset form state and current row when the drawer is closed.
     * Only resets the form if no submission is currently in progress.
     */
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

    // --- Context Value ---

    /** The value provided by the StaffContext. */
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
        isConfirmOpen,
        confirmActionType,
        targetStaffId,
        targetStaffGroups,
        isConfirmLoading,
        handleOpenDeleteConfirm,
        handleOpenActivateConfirm,
        handleOpenDeactivateConfirm,
        handleConfirmAction,
        handleCloseConfirm,
    };

    return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

// --- Custom Hook ---

/**
 * Custom hook to consume the StaffContext.
 * Ensures the hook is used within a StaffProvider.
 * @returns The StaffContext value.
 * @throws Error if used outside of a StaffProvider.
 */
export const useStaff = () => {
    const staffContext = React.useContext(StaffContext);

    if (!staffContext) {
        throw new Error('useStaff must be used within a StaffProvider component.');
    }

    return staffContext;
};
