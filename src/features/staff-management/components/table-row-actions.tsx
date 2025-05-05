import { Row } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStaff } from '../context/staff-context';
import { Staff } from '../types/types';
import { MoreHorizontal } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const staff = row.original as Staff;
    const { openDrawerForAction, handleOpenDeleteConfirm, handleOpenActivateConfirm, handleOpenDeactivateConfirm } =
        useStaff();

    const handleEdit = () => {
        openDrawerForAction('edit', staff);
    };

    const handleDelete = () => {
        handleOpenDeleteConfirm(String(staff.id));
    };

    const handleActivate = () => {
        handleOpenActivateConfirm(String(staff.id), staff.groups);
    };

    const handleDeactivate = () => {
        handleOpenDeactivateConfirm(String(staff.id), staff.groups);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                {staff.is_active ? (
                    <DropdownMenuItem onClick={handleDeactivate} className="text-orange-600 focus:text-orange-600">
                        Deactivate
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={handleActivate} className="text-green-600 focus:text-green-600">
                        Activate
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
