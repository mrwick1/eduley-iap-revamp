import { Button } from '@/components/ui/button';
import { IconUserPlus } from '@tabler/icons-react';

export const StaffManagementPrimaryButtons = ({ onAddStaff }: { onAddStaff: () => void }) => {
    return (
        <div className="flex gap-2 pb-2">
            <Button
                variant="outline"
                className="space-x-1"
                onClick={onAddStaff}
                infoMessage="Add a new staff member and assign them to a role"
            >
                <IconUserPlus size={18} />
                <span>New Staff</span>
            </Button>
        </div>
    );
};
