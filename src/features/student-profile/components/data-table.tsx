import { TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from './table-toolbar';
import { useStudentProfile } from '../context/student-profile-context';
import { CommonDataTable } from '@/components/common/data-table';
import { StudentProfile } from '../types/types';
import { Column } from '@tanstack/react-table';

// Function to render skeleton rows specifically for student profiles
const renderStudentSkeleton = (columns: Column<StudentProfile, unknown>[], pageSize: number) => {
    return Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
            {columns.map((column) => {
                const columnId = column.id; // Use column.id which is guaranteed
                if (columnId === 'name') {
                    return (
                        <TableCell key={column.id}>
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </TableCell>
                    );
                }
                if (columnId === 'profileStatus') {
                    return (
                        <TableCell key={column.id}>
                            <div className="flex w-[100px] items-center">
                                <Skeleton className="h-3 w-4 mr-2" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </TableCell>
                    );
                }
                if (columnId === 'actions') {
                    return (
                        <TableCell key={column.id}>
                            <Skeleton className="h-8 w-20" />
                        </TableCell>
                    );
                }
                // Default skeleton for other columns
                return (
                    <TableCell key={column.id}>
                        <Skeleton className="h-5 w-16" />
                    </TableCell>
                );
            })}
        </TableRow>
    ));
};

export function DataTable() {
    const { table, isLoading } = useStudentProfile();

    return (
        <CommonDataTable<StudentProfile>
            table={table}
            isLoading={isLoading}
            toolbar={<DataTableToolbar table={table} />}
            renderSkeleton={renderStudentSkeleton}
            noResultsMessage={<span className="text-muted-foreground">No students found.</span>}
        />
    );
}
