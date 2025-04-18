import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './table-pagination';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    pageIndex: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    totalCount: number;
    isLoading?: boolean;
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
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                onPageChange(newState.pageIndex);
                onPageSizeChange(newState.pageSize);
            }
        },
    });

    return (
        <div className="space-y-4">
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
                                    {columns.map((column, colIndex) => {
                                        // Custom skeleton dimensions based on column type
                                        const columnId = column.id || ((column as any).accessorKey as string);
                                        if (columnId === 'name') {
                                            return (
                                                <TableCell key={colIndex}>
                                                    <div className="flex flex-col gap-2">
                                                        <Skeleton className="h-4 w-32" />
                                                        <Skeleton className="h-3 w-48" />
                                                    </div>
                                                </TableCell>
                                            );
                                        }
                                        if (columnId === 'profileStatus') {
                                            return (
                                                <TableCell key={colIndex}>
                                                    <div className="flex w-[100px] items-center">
                                                        <Skeleton className="h-3 w-4 mr-2" />
                                                        <Skeleton className="h-3 w-16" />
                                                    </div>
                                                </TableCell>
                                            );
                                        }
                                        if (columnId === 'actions') {
                                            return (
                                                <TableCell key={colIndex}>
                                                    <Skeleton className="h-8 w-20" />
                                                </TableCell>
                                            );
                                        }
                                        return (
                                            <TableCell key={colIndex}>
                                                <Skeleton className="h-5 w-16" />
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
