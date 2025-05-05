import { ColumnDef } from '@tanstack/react-table';
import { Staff } from '../types/types';
import { ROLE_NAMES } from '@/const/role';
import { DataTableRowActions } from './table-row-actions';
import { Status } from '@/components/ui/status';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStaff } from '../context/staff-context';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

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
            const { first_name, last_name, profile_photo } = row.original;
            const initials = `${first_name?.[0] ?? ''}`.toUpperCase();
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={profile_photo ?? undefined} alt={`${first_name} ${last_name}`} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium">
                        {first_name} {last_name}
                    </p>
                </div>
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
            const {
                openDrawerForAction,
                handleOpenDeleteConfirm,
                handleOpenActivateConfirm,
                handleOpenDeactivateConfirm,
            } = useStaff();

            return (
                <DataTableRowActions>
                    <DropdownMenuItem onClick={() => openDrawerForAction('edit', row.original)}>Edit</DropdownMenuItem>
                    {row.original.is_active ? (
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleOpenDeactivateConfirm(String(row.original.id), row.original.groups)}
                        >
                            Deactivate
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => handleOpenActivateConfirm(String(row.original.id), row.original.groups)}
                        >
                            Activate
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleOpenDeleteConfirm(String(row.original.id))}
                    >
                        Delete
                    </DropdownMenuItem>
                </DataTableRowActions>
            );
        },
    },
];
