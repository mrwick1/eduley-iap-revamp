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

export default function StudentProfile() {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filter, setFilter] = useState({
        search: '',
        status: '',
    });
    const { data, isLoading } = useQuery({
        queryKey: ['students', pageIndex, pageSize, filter.search, filter.status],
        queryFn: () => getAllStudents(pageSize, pageIndex * pageSize, filter.search, filter.status),
    });
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        if (!isLoading && data?.count !== undefined) {
            setTotalCount(data.count);
        }
    }, [data?.count, isLoading]);

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
                    <StudentProfilePrimaryButtons />
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
                />
            </Main>
        </div>
    );
}
