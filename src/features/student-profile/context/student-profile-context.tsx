import React, { createContext, useContext } from 'react';
import { Table, ColumnDef } from '@tanstack/react-table';
import { useStudentProfileTable } from '../hooks/use-student-profile-table';
import { columns } from '../components/columns'; // Import columns definition
import { StudentProfile } from '../types/types'; // Import the main data type

// Define the shape of the filter state
interface FilterState {
    search: string;
    status: string;
}

// Define the shape of the context value
interface StudentProfileContextType {
    table: Table<StudentProfile>;
    isLoading: boolean;
    filter: FilterState;
    totalCount: number;
    columns: ColumnDef<StudentProfile, unknown>[]; // Include columns if needed by consumers
}

// Create the context
const StudentProfileContext = createContext<StudentProfileContextType | null>(null);

// Define props for the provider
interface Props {
    children: React.ReactNode;
}

// Create the provider component
export function StudentProfileProvider({ children }: Props) {
    // Call the hook internally, passing the imported columns
    const { table, isLoading, filter, totalCount } = useStudentProfileTable<StudentProfile, unknown>({ columns });

    // Prepare the context value
    const value: StudentProfileContextType = {
        table: table as Table<StudentProfile>, // Cast table instance to specific type
        isLoading,
        filter,
        totalCount,
        columns, // Provide columns through context
    };

    return <StudentProfileContext.Provider value={value}>{children}</StudentProfileContext.Provider>;
}

// Create the consumer hook
export const useStudentProfile = () => {
    const context = useContext(StudentProfileContext);
    if (!context) {
        throw new Error('useStudentProfile must be used within a StudentProfileProvider');
    }
    return context;
};
