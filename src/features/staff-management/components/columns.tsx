import { ColumnDef } from '@tanstack/react-table';
import { Staff } from '../types/types';
import { ROLE_NAMES } from '@/const/role';
import { DataTableRowActions } from './table-row-actions';
import { Status } from '@/components/ui/status';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
                    className="flex items-center gap-1 font-bold"
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
            const visibleRoles = groups.slice(0, 3);
            const hiddenRoles = groups.slice(3);

            if (groups.length === 0) {
                return <p className="text-sm font-medium">N/A</p>;
            }

            return (
                <div className="flex flex-wrap gap-1 items-center">
                    {visibleRoles.map((group) => (
                        <Badge key={group} variant="outline">
                            {ROLE_NAMES[group]}
                        </Badge>
                    ))}
                    {hiddenRoles.length > 0 && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="text-sm text-muted-foreground  cursor-pointer">
                                    +{hiddenRoles.length} more
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="max-w-sm flex flex-wrap gap-1 p-2">
                                {hiddenRoles.map((group) => (
                                    <Badge key={group} variant="secondary">
                                        {ROLE_NAMES[group]}
                                    </Badge>
                                ))}
                            </PopoverContent>
                        </Popover>
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
