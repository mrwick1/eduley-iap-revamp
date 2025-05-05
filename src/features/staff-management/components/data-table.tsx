import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from './table-toolbar';
import { useStaffTable } from '../hooks/use-staff-table';
import { columns } from './columns';
import { Staff } from '../types/types';
import { CommonDataTable } from '@/components/common/data-table';
import { Column } from '@tanstack/react-table';

// Function to render skeleton rows specifically for staff management
const renderStaffSkeleton = (tableColumns: Column<Staff, unknown>[], pageSize: number) => {
    return Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
            {tableColumns.map((column) => {
                const columnId = column.id;
                return (
                    <TableCell key={columnId}>
                        {columnId === 'role' ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-wrap gap-1">
                                    {/* Assuming max 3 roles for skeleton */}
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <Skeleton key={i} className="h-5 w-32" />
                                    ))}
                                </div>
                            </div>
                        ) : columnId === 'actions' ? (
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-9 w-16" />
                                <Skeleton className="h-9 w-16" />
                            </div>
                        ) : (
                            // Default skeleton for other columns
                            <Skeleton className="h-5 w-24" />
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    ));
};

export function DataTable() {
    const { table, isLoading } = useStaffTable({ columns });

    return (
        <CommonDataTable<Staff>
            table={table}
            isLoading={isLoading}
            toolbar={<DataTableToolbar table={table} />}
            renderSkeleton={renderStaffSkeleton}
            noResultsMessage={<span className="text-muted-foreground">No staff found.</span>}
        />
    );
}
