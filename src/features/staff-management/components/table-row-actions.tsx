import { Row } from '@tanstack/react-table';
import { IconTrash, IconDots } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useStaff } from '../context/staff-context';
import { staffSchema } from '../schema/schema';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const staff = staffSchema.parse(row.original);

    const { setOpen, setCurrentRow } = useStaff();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                    <IconDots className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(staff);
                        setOpen('update');
                    }}
                >
                    Edit
                </DropdownMenuItem>
                {staff.instructor_id && <DropdownMenuItem>Update Instructor Qualification</DropdownMenuItem>}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(staff);
                        setOpen('delete');
                    }}
                >
                    Delete
                    <DropdownMenuShortcut>
                        <IconTrash size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
