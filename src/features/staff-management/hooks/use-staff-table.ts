import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { VisibilityState } from '@tanstack/react-table';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { getAllStaff } from '../api/api';
import { StaffResponse } from '../types/types'; // Correct import path
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
} from '@tanstack/react-table';

const TABLE_ID = 'staff-management';

interface UseStaffTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function useStaffTable<TData, TValue>({ columns }: UseStaffTableProps<TData, TValue>) {
    const { tables, setTablePreferences } = usePreferencesStore();
    const tablePreferences = tables[TABLE_ID] || {
        activePage: 0,
        rowsPerPage: 10,
        visibleColumns: {} as VisibilityState,
        search: { name: '' },
        filters: { status: '', role: '', ordering: '-id' },
    };

    const [pageIndex, setPageIndex] = useState(tablePreferences.activePage);
    const [pageSize, setPageSize] = useState(tablePreferences.rowsPerPage);
    const [filter, setFilter] = useState({
        search: tablePreferences.search.name || '',
        status: tablePreferences.filters?.status || '',
        role: tablePreferences.filters?.role || '',
        ordering: tablePreferences.filters?.ordering || '-id',
    });

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(tablePreferences.visibleColumns || {});
    const [sorting, setSorting] = useState<SortingState>(() => {
        const initialOrdering = tablePreferences.filters?.ordering || '-id';
        if (initialOrdering) {
            const desc = initialOrdering.startsWith('-');
            const id = desc ? initialOrdering.substring(1) : initialOrdering;
            return [{ id, desc }];
        }
        return [];
    });

    const { data, isLoading, isFetching } = useQuery<StaffResponse | null>({
        queryKey: ['staff', pageIndex, pageSize, filter],
        queryFn: () =>
            getAllStaff(pageSize, pageIndex * pageSize, filter.search, filter.status, filter.role, filter.ordering),
        placeholderData: keepPreviousData, // Use placeholderData for v5
    });

    // Update store when preferences change
    useEffect(() => {
        setTablePreferences(TABLE_ID, {
            activePage: pageIndex,
            rowsPerPage: pageSize,
            visibleColumns: columnVisibility,
            search: { name: filter.search },
            filters: { status: filter.status, role: filter.role, ordering: filter.ordering },
        });
    }, [pageIndex, pageSize, columnVisibility, filter, setTablePreferences]);

    const tableData = data?.results || [];
    const totalCount = data?.count ?? 0;

    const table = useReactTable({
        data: tableData as TData[],
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
            ],
        },
        onSortingChange: (updater) => {
            let newOrdering = '-id'; // Default ordering
            if (typeof updater === 'function') {
                const newSorting = updater(sorting);
                setSorting(newSorting);

                if (newSorting.length > 0) {
                    const { id, desc } = newSorting[0];
                    newOrdering = desc ? `-${id}` : id;
                }
            } else {
                setSorting(updater);
                if (updater.length > 0) {
                    const { id, desc } = updater[0];
                    newOrdering = desc ? `-${id}` : id;
                }
            }
            setPageIndex(0);
            setFilter((prev) => ({ ...prev, ordering: newOrdering }));
        },
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
                setPageSize(newState.pageSize);
            }
        },

        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: (updater) => {
            let newFilters: Record<string, string> = {};
            if (typeof updater === 'function') {
                const currentFilters = [
                    { id: 'name', value: filter.search },
                    { id: 'status', value: filter.status },
                    { id: 'role', value: filter.role },
                ];
                const updatedFilters = updater(currentFilters);
                updatedFilters.forEach((f) => {
                    newFilters[f.id] = f.value as string;
                });
            } else {
                updater.forEach((f) => {
                    newFilters[f.id] = f.value as string;
                });
            }

            setFilter((prev) => ({
                ...prev,
                search: newFilters['name'] ?? '',
                status: newFilters['status'] ?? '',
                role: newFilters['role'] ?? '',
            }));
            setPageIndex(0); // Reset page index when filters change
        },
    });

    return {
        table,
        isLoading: isLoading || isFetching,
        setFilter,
        filter,
    };
}
