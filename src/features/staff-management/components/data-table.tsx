import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    VisibilityState,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from './table-toolbar';
import { DataTablePagination } from '@/components/table/table-pagination';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageIndex: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    totalCount: number;
    isLoading?: boolean;
    filter: {
        search: string;
        status: string;
        role: string;
        ordering: string;
    };
    onFilterChange: (filter: { search: string; status: string; role: string; ordering: string }) => void;
    columnVisibility: VisibilityState;
    onColumnVisibilityChange: (visibility: VisibilityState) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageIndex,
    pageSize,
    onPageChange,
    onPageSizeChange,
    totalCount,
    isLoading = false,
    filter,
    onFilterChange,
    columnVisibility,
    onColumnVisibilityChange,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            sorting,
            columnVisibility,
            columnFilters: [
                { id: 'name', value: filter.search },
                { id: 'status', value: filter.status },
                { id: 'role', value: filter.role },
                { id: 'ordering', value: filter.ordering },
            ],
        },
        onSortingChange: (updater) => {
            if (typeof updater === 'function') {
                const newSorting = updater(sorting);
                setSorting(newSorting);

                // Convert sorting state to ordering string
                if (newSorting.length > 0) {
                    const { id, desc } = newSorting[0];
                    const ordering = desc ? `-${id}` : id;
                    onFilterChange({ ...filter, ordering });
                } else {
                    onFilterChange({ ...filter, ordering: '' });
                }
            }
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                onPageChange(newState.pageIndex);
                onPageSizeChange(newState.pageSize);
            }
        },
        onColumnFiltersChange: (updater) => {
            if (typeof updater === 'function') {
                const newFilters = updater([
                    { id: 'name', value: filter.search },
                    { id: 'status', value: filter.status },
                    { id: 'role', value: filter.role },
                    { id: 'ordering', value: filter.ordering },
                ]);
                const search = (newFilters.find((f) => f.id === 'name')?.value as string) || '';
                const status = (newFilters.find((f) => f.id === 'status')?.value as string) || '';
                const role = (newFilters.find((f) => f.id === 'role')?.value as string) || '';
                const ordering = (newFilters.find((f) => f.id === 'ordering')?.value as string) || '';
                onFilterChange({ search, status, role, ordering });
            }
        },
        onColumnVisibilityChange: (updater) => {
            if (typeof updater === 'function') {
                const newVisibility = updater(columnVisibility);
                onColumnVisibilityChange(newVisibility);
            }
        },
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} />
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
                            Array.from({ length: pageSize }).map((_, index) => (
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
            <DataTablePagination table={table} />
        </div>
    );
}
