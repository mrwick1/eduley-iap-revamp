import { flexRender, Table as ReactTable, Column } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/table/table-pagination';
import React from 'react';

interface CommonDataTableProps<T> {
    table: ReactTable<T>;
    isLoading: boolean;
    toolbar: React.ReactNode;
    renderSkeleton: (columns: Column<T, unknown>[], pageSize: number) => React.ReactNode;
    noResultsMessage?: React.ReactNode;
}

export function CommonDataTable<T>({
    table,
    isLoading,
    toolbar,
    renderSkeleton,
    noResultsMessage = 'No results.',
}: CommonDataTableProps<T>) {
    const columns = table.getVisibleLeafColumns();
    const pageSize = table.getState().pagination.pageSize;

    return (
        <div className="space-y-4">
            {toolbar}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                        >
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
                            renderSkeleton(columns, pageSize)
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
                                    {noResultsMessage}
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
