import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { IconUserPlus } from '@tabler/icons-react';

export const StaffManagementPrimaryButtons = ({ onAddStaff }: { onAddStaff: () => void }) => {
    return (
        <div className="flex gap-2 pb-2">
            <Tooltip message="Add a new staff member and assign them to a role">
                <Button variant="outline" className="space-x-1" onClick={onAddStaff}>
                    <IconUserPlus size={18} />
                    <span>New Staff</span>
                </Button>
            </Tooltip>
        </div>
    );
};
