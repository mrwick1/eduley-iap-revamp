import { ColumnDef, flexRender, Table as ReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from './table-toolbar';
import { DataTablePagination } from '@/components/table/table-pagination';
import { useStaffTable } from '../hooks/use-staff-table';
import { Staff } from '../types/types';

interface DataTableProps<TData extends Staff, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData extends Staff, TValue>({ columns }: DataTableProps<TData, TValue>) {
    const { table, isLoading } = useStaffTable<TData, TValue>({ columns });

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table as ReactTable<TData>} />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: table.getState().pagination.pageSize }).map((_, index) => (
                                <TableRow key={index}>
                                    {table.getVisibleLeafColumns().map((column) => {
                                        const columnId = column.id;
                                        return (
                                            <TableCell key={columnId}>
                                                {columnId === 'role' ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex flex-wrap gap-1">
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
                                                    <Skeleton className="h-5 w-24" />
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table as ReactTable<TData>} />
        </div>
    );
}
