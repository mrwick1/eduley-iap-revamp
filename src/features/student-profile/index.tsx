import { Search } from '@/components/search';
import { Head } from '@/components/seo';
import { Header } from '@/components/sidebar/Header';
import { Main } from '@/layout/main';
import { StudentProfilePrimaryButtons } from './components/primary-button';
import { DataTable } from './components/data-table';
import { getAllStudents } from './api/api';
import { useQuery } from '@tanstack/react-query';
import { columns } from './components/columns';
import { useState, useEffect } from 'react';
import { VisibilityState } from '@tanstack/react-table';
import { usePreferencesStore } from '@/store/usePreferencesStore';
import useExcelDownload from '@/hooks/use-excel-downlaod';
import { apiEndpoints } from '@/config/api-endpoints';

const TABLE_ID = 'student-profile';

export default function StudentProfile() {
    const { downloadExcel, isDownloading } = useExcelDownload();
    const { tables, setTablePreferences } = usePreferencesStore();
    const tablePreferences = tables[TABLE_ID] || {
        activePage: 0,
        rowsPerPage: 10,
        visibleColumns: {} as VisibilityState,
        search: { name: '' },
        filters: { status: '' },
    };

    const [pageIndex, setPageIndex] = useState(tablePreferences.activePage);
    const [pageSize, setPageSize] = useState(tablePreferences.rowsPerPage);
    const [filter, setFilter] = useState<{ search: string; status: string }>({
        search: tablePreferences.search.name || '',
        status: tablePreferences.filters?.status || '',
    });
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(tablePreferences.visibleColumns || {});
    const [totalCount, setTotalCount] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['students', pageIndex, pageSize, filter.search, filter.status],
        queryFn: () => getAllStudents(pageSize, pageIndex * pageSize, filter.search, filter.status),
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
            filters: { status: filter.status },
        });
    }, [pageIndex, pageSize, columnVisibility, filter, setTablePreferences]);

    const handleDownloadExcel = async () => {
        await downloadExcel({
            endpoint: apiEndpoints.studentProfileDownloadExcel,
            queryParams: {
                search: filter.search,
                profile_verified: filter.status === 'all' ? '' : filter.status,
            },
            filenamePrefix: 'Student Profile',
            filenameFilters: [filter.status === 'all' ? '' : filter.status, filter.search ? filter.search : ''],
            excludeFields: ['subscriptions', 'gamification_details'],
        });
    };

    return (
        <div className="flex h-screen flex-col">
            <Head title="Student Profile" />
            <Header>
                <Search />
            </Header>

            <Main>
                <div className="mb-2 flex flex-wrap items-end justify-between space-y-2 gap-y-2.5">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold tracking-tight md:text-2xl">Student Profile</h1>
                        <p className=" text-muted-foreground text-sm md:text-base">
                            See all students here. Check their profile status, courses taken, and points. Filter by
                            status, search names, and download the list as an Excel file.
                        </p>
                    </div>
                    <StudentProfilePrimaryButtons
                        isDownloading={isDownloading}
                        handleDownloadExcel={handleDownloadExcel}
                    />
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
    );
}
