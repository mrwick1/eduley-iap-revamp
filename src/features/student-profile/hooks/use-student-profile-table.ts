import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { VisibilityState } from '@tanstack/react-table';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { getAllStudents } from '../api/api';
import { ReportResponse } from '../types/types';
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel, // Keep if sorting is needed later
    SortingState, // Keep if sorting is needed later
} from '@tanstack/react-table';

const TABLE_ID = 'student-profile';

interface UseStudentProfileTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export function useStudentProfileTable<TData, TValue>({ columns }: UseStudentProfileTableProps<TData, TValue>) {
    const { tables, setTablePreferences } = usePreferencesStore();
    const tablePreferences = tables[TABLE_ID] || {
        activePage: 0,
        rowsPerPage: 10,
        visibleColumns: {} as VisibilityState,
        search: { name: '' },
        filters: { status: '' }, // Only status filter for students
    };

    const [pageIndex, setPageIndex] = useState(tablePreferences.activePage);
    const [pageSize, setPageSize] = useState(tablePreferences.rowsPerPage);
    const [filter, setFilter] = useState<{ search: string; status: string }>(() => ({
        search: tablePreferences.search?.name || '',
        status: tablePreferences.filters?.status || '',
    }));

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(tablePreferences.visibleColumns || {});
    // Add sorting state if sorting becomes required
    // const [sorting, setSorting] = useState<SortingState>([]);

    const { data, isLoading, isFetching, error } = useQuery<ReportResponse | null>({
        queryKey: ['students', pageIndex, pageSize, filter.search, filter.status],
        queryFn: () => getAllStudents(pageSize, pageIndex * pageSize, filter.search, filter.status),
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        // Handle query errors if needed
        if (error) {
            console.error('Failed to fetch student profiles:', error);
            // Optionally show a toast or error message
        }
    }, [error]);

    // Update store when preferences change
    useEffect(() => {
        setTablePreferences(TABLE_ID, {
            activePage: pageIndex,
            rowsPerPage: pageSize,
            visibleColumns: columnVisibility,
            search: { name: filter.search },
            filters: { status: filter.status },
        });
    }, [pageIndex, pageSize, columnVisibility, filter, setTablePreferences]);

    const tableData = data?.results || [];
    const totalCount = data?.count ?? 0;

    const table = useReactTable({
        data: tableData as TData[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(), // Keep if sorting added later
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,
        manualFiltering: true, // Indicate filters are handled externally (via query)
        // manualSorting: true, // Add if sorting is added
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            // sorting, // Add if sorting is added
            columnVisibility,
            columnFilters: [
                // Reflect current filter state for components like DataTableToolbar
                { id: 'name', value: filter.search },
                // Provide status to the table state as array/undefined for FacetedFilter UI
                { id: 'profileStatus', value: filter.status ? [filter.status] : undefined },
            ],
        },
        // onSortingChange: (updater) => { // Add if sorting is added
        onPaginationChange: (updater) => {
            if (typeof updater === 'function') {
                const newState = updater({ pageIndex, pageSize });
                setPageIndex(newState.pageIndex);
                setPageSize(newState.pageSize);
            }
        },
        onColumnFiltersChange: (updater) => {
            let newFilters: Record<string, string> = {};
            if (typeof updater === 'function') {
                const currentFilters = [
                    { id: 'name', value: filter.search },
                    { id: 'profileStatus', value: filter.status },
                ];
                const updatedFilters = updater(currentFilters);
                updatedFilters.forEach((f) => {
                    if (f.id === 'profileStatus') {
                        // Handle potential array from single-select FacetedFilter
                        const value = f.value as string[] | string | undefined | null;
                        if (Array.isArray(value)) {
                            newFilters[f.id] = value[0] ?? ''; // Take first element or empty string
                        } else {
                            newFilters[f.id] = String(value ?? ''); // Handle string or undefined/null
                        }
                    } else {
                        // Treat other filters (like name) as strings
                        newFilters[f.id] = String(f.value ?? '');
                    }
                });
            } else {
                // If updater is an array of ColumnFilter
                updater.forEach((f) => {
                    if (f.id === 'profileStatus') {
                        const value = f.value as string[] | string | undefined | null;
                        if (Array.isArray(value)) {
                            newFilters[f.id] = value[0] ?? '';
                        } else {
                            newFilters[f.id] = String(value ?? '');
                        }
                    } else {
                        newFilters[f.id] = String(f.value ?? '');
                    }
                });
            }

            // Update the hook's filter state, which triggers the useQuery refetch
            setFilter({
                search: newFilters['name'] ?? '',
                status: newFilters['profileStatus'] ?? '', // Status is now correctly extracted string
            });
            setPageIndex(0); // Reset page index when filters change
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    return {
        table,
        isLoading: isLoading || isFetching,
        filter, // Expose filter state if needed externally (e.g., for download function)
        setFilter, // Expose setter if needed
        totalCount, // Expose totalCount if needed
    };
}
