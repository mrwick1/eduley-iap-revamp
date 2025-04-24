import React, { useState } from 'react';
import useDialogState from '@/hooks/use-dialogue';
import { Staff } from '../schema/schema';

type StaffDialogType = 'create' | 'update' | 'delete' | 'import';

interface StaffContextType {
    open: StaffDialogType | null;
    setOpen: (str: StaffDialogType | null) => void;
    currentRow: Staff | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<Staff | null>>;
}

const StaffContext = React.createContext<StaffContextType | null>(null);

interface Props {
    children: React.ReactNode;
}

export default function StaffProvider({ children }: Props) {
    const [open, setOpen] = useDialogState<StaffDialogType>(null);
    const [currentRow, setCurrentRow] = useState<Staff | null>(null);
    return (
        <StaffContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>{children}</StaffContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStaff = () => {
    const staffContext = React.useContext(StaffContext);

    if (!staffContext) {
        throw new Error('useStaff has to be used within <StaffContext>');
    }

    return staffContext;
};
