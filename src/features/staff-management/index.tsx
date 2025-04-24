import { Search } from '@/components/search';
import { Head } from '@/components/seo/head';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';
import { StaffManagementPrimaryButtons } from './components/primary-button';
import { getAllStaff } from './api/api';
import { useQuery } from '@tanstack/react-query';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import { VisibilityState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import StaffProvider from './context/staff-context';

const TABLE_ID = 'staff-management';

export default function StaffManagement() {
    const { tables, setTablePreferences } = usePreferencesStore();
    const tablePreferences = tables[TABLE_ID] || {
        activePage: 0,
        rowsPerPage: 10,
        visibleColumns: {} as VisibilityState,
        search: { name: '' },
        filters: { status: '', role: '', ordering: '' },
    };

    const [pageIndex, setPageIndex] = useState(tablePreferences.activePage);
    const [pageSize, setPageSize] = useState(tablePreferences.rowsPerPage);
    const [filter, setFilter] = useState<{ search: string; status: string; role: string; ordering: string }>({
        search: tablePreferences.search.name || '',
        status: tablePreferences.filters?.status || '',
        role: tablePreferences.filters?.role || '',
        ordering: tablePreferences.filters?.ordering || '',
    });
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(tablePreferences.visibleColumns || {});
    const [totalCount, setTotalCount] = useState(0);
    const { data, isLoading } = useQuery({
        queryKey: ['staff', pageIndex, pageSize, filter],
        queryFn: () =>
            getAllStaff(pageSize, pageIndex * pageSize, filter.search, filter.status, filter.role, filter.ordering),
    });

    useEffect(() => {
        if (!isLoading && data?.count !== undefined) {
            setTotalCount(data.count);
        }
    }, [data?.count, isLoading]);

    // Update store when preferences change
    useEffect(() => {
        setTablePreferences(TABLE_ID, {
            activePage: pageIndex,
            rowsPerPage: pageSize,
            visibleColumns: columnVisibility,
            search: { name: filter.search },
            filters: { status: filter.status, role: filter.role },
        });
    }, [pageIndex, pageSize, columnVisibility, filter, setTablePreferences]);

    return (
        <StaffProvider>
            <div className="flex h-screen flex-col">
                <Head title="Staff Management" />
                <Header>
                    <Search />
                </Header>

                <Main>
                    <div className="mb-2 flex flex-wrap items-end justify-between space-y-2 gap-y-2.5">
                        <div className="space-y-1">
                            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Staff Management</h1>
                            <p className=" text-muted-foreground text-sm md:text-base max-w-5xl">
                                Manage and organize staff members, assign roles, track status, filter/search users, and
                                download the list as an Excel file.
                            </p>
                        </div>
                        <StaffManagementPrimaryButtons />
                    </div>
                    <DataTable
                        columns={columns}
                        data={data?.results || []}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        onPageChange={setPageIndex}
                        onPageSizeChange={setPageSize}
                        totalCount={totalCount ?? 0}
                        isLoading={isLoading}
                        filter={filter}
                        onFilterChange={setFilter}
                        columnVisibility={columnVisibility}
                        onColumnVisibilityChange={setColumnVisibility}
                    />
                </Main>
            </div>
        </StaffProvider>
    );
}
