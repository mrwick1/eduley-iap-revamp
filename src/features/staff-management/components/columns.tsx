import { ColumnDef } from '@tanstack/react-table';
import { Staff } from '../types/types';
import { ROLE_NAMES } from '@/const/role';
import { DataTableRowActions } from './table-row-actions';
import { Status } from '@/components/ui/status';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<Staff>[] = [
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1"
                >
                    ID
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="h-4 w-4" />
                    )}
                </Button>
            );
        },
        accessorKey: 'id',
        cell: ({ row }) => {
            const { id } = row.original;
            return <p className="text-sm font-medium">{id}</p>;
        },
    },
    {
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => {
            const { first_name, last_name } = row.original;
            return (
                <p className="text-sm font-medium">
                    {first_name} {last_name}
                </p>
            );
        },
    },
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="flex items-center gap-1"
                >
                    Email
                    {column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="h-4 w-4" />
                    ) : column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="h-4 w-4" />
                    ) : (
                        <ArrowUpDown className="h-4 w-4" />
                    )}
                </Button>
            );
        },
        accessorKey: 'email',
        cell: ({ row }) => {
            const { email } = row.original;
            return <p className="text-sm font-medium">{email}</p>;
        },
    },
    {
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row }) => {
            const { groups } = row.original;
            const firstLine = groups.slice(0, 6);
            const secondLine = groups.slice(6, 12);
            const remainingRoles = groups.slice(12);

            if (groups.length === 0) {
                return <p className="text-sm font-medium">N/A</p>;
            }

            return (
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1">
                        {firstLine.map((group) => (
                            <span key={group} className="text-sm font-medium">
                                {ROLE_NAMES[group]}
                            </span>
                        ))}
                    </div>
                    {(secondLine.length > 0 || remainingRoles.length > 0) && (
                        <div className="flex flex-wrap gap-1">
                            {secondLine.map((group) => (
                                <span key={group} className="text-sm font-medium">
                                    {ROLE_NAMES[group]}
                                </span>
                            ))}
                            {remainingRoles.length > 0 && (
                                <span className="text-sm font-medium text-muted-foreground">
                                    +{remainingRoles.length} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            const { is_active } = row.original;
            return <Status text={is_active ? 'Active' : 'Inactive'} status={is_active ? 'success' : 'error'} />;
        },
    },
    {
        header: 'Actions',
        accessorKey: 'actions',
        cell: ({ row }) => {
            return <DataTableRowActions row={row} />;
        },
    },
];
