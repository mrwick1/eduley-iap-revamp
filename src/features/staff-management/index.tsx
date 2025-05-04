import { Search } from '@/components/search';
import { Head } from '@/components/seo/head';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';
import { StaffManagementPrimaryButtons } from './components/primary-button';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import StaffProvider, { useStaff } from './context/staff-context';
import { Drawer } from '@/components/ui/sheet';
import { StaffForm } from './components/staff-form';
import { ConfirmDialog } from '@/components/confirm-dialogue';
import { useMemo } from 'react';

const StaffManagementContent = () => {
    const {
        form,
        handleFormSubmit,
        isDrawerOpen,
        setIsDrawerOpen,
        isSubmitting,
        actionType,
        openDrawerForAction,
        isConfirmOpen,
        confirmActionType,
        isConfirmLoading,
        handleConfirmAction,
        handleCloseConfirm,
    } = useStaff();

    const handleSave = () => {
        form.handleSubmit(handleFormSubmit)();
    };

    const isEditing = actionType === 'edit';
    const drawerTitle = isEditing ? 'Edit Staff' : 'Add New Staff';
    const drawerDescription = isEditing
        ? 'Update the details for this staff member.'
        : 'Add a new staff member to the system.';

    const handleAddStaffClick = () => {
        openDrawerForAction('add');
    };

    const confirmDialogContent = useMemo(() => {
        switch (confirmActionType) {
            case 'delete':
                return {
                    title: 'Delete Staff Member',
                    desc: 'Are you sure you want to delete this staff member? This action cannot be undone.',
                    confirmText: 'Delete',
                    destructive: true,
                };
            case 'activate':
                return {
                    title: 'Activate Staff Member',
                    desc: 'Are you sure you want to activate this staff member?',
                    confirmText: 'Activate',
                    destructive: false,
                };
            case 'deactivate':
                return {
                    title: 'Deactivate Staff Member',
                    desc: 'Are you sure you want to deactivate this staff member? They will lose access.',
                    confirmText: 'Deactivate',
                    destructive: true,
                };
            default:
                return {
                    title: '',
                    desc: '',
                    confirmText: 'Confirm',
                    destructive: false,
                };
        }
    }, [confirmActionType]);

    return (
        <>
            <div className="flex h-screen flex-col">
                <Head title="Staff Management" />
                <Header>
                    <Search />
                </Header>

                <Main>
                    <div className="mb-2 flex flex-wrap items-end justify-between space-y-2 gap-y-2.5">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Staff Management</h1>
                            <p className=" text-muted-foreground text-sm md:text-base max-w-5xl">
                                Manage and organize staff members, assign roles, track status, filter/search users, and
                                download the list as an Excel file.
                            </p>
                        </div>
                        <StaffManagementPrimaryButtons onAddStaff={handleAddStaffClick} />
                    </div>
                    <DataTable columns={columns} />
                </Main>
            </div>
            <Drawer
                maxWidth="600px"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerTitle}
                onSave={handleSave}
                onCancel={() => setIsDrawerOpen(false)}
                isLoading={isSubmitting}
                description={drawerDescription}
            >
                <StaffForm />
            </Drawer>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={handleCloseConfirm}
                title={confirmDialogContent.title}
                desc={confirmDialogContent.desc}
                confirmText={confirmDialogContent.confirmText}
                destructive={confirmDialogContent.destructive}
                isLoading={isConfirmLoading}
                handleConfirm={handleConfirmAction}
            />
        </>
    );
};

export default function StaffManagement() {
    return (
        <StaffProvider>
            <StaffManagementContent />
        </StaffProvider>
    );
}
