import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';
import { DataTableFacetedFilter } from '../../../components/table/data-table-filter';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DataTableViewOptions } from '../../../components/table/table-view-options';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const [searchValue, setSearchValue] = useState('');

    // Initialize search value from table filter
    useEffect(() => {
        const initialSearchValue = (table.getColumn('name')?.getFilterValue() as string) || '';
        setSearchValue(initialSearchValue);
    }, [table]);

    const debouncedSetFilter = useDebouncedCallback((value: string) => {
        table.getColumn('name')?.setFilterValue(value);
        table.resetPageIndex();
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
        debouncedSetFilter(value);
    };

    const handleReset = () => {
        setSearchValue('');
        table.resetColumnFilters();
    };

    const statusFilterValue = table.getColumn('profileStatus')?.getFilterValue() as string[] | undefined;
    const hasActiveFilters = searchValue || (statusFilterValue && statusFilterValue.length > 0);

    return (
        <div className="flex items-start md:items-center justify-between flex-wrap gap-y-4">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2 ">
                <div className="flex items-center space-x-2 flex-wrap gap-y-4">
                    <Input
                        placeholder="Search by name or email"
                        value={searchValue}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        className="h-8 w-[250px] lg:w-[250px]"
                    />
                    <DataTableFacetedFilter
                        column={table.getColumn('profileStatus')}
                        title="Profile Status"
                        options={[
                            { label: 'Verified', value: 'verified' },
                            { label: 'Pending', value: 'pending' },
                        ]}
                        showSearch={false}
                        multiSelect={false}
                        table={table}
                    />
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
