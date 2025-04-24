import { Button } from '@/components/ui/button';
import { IconUserPlus } from '@tabler/icons-react';

export const StaffManagementPrimaryButtons = () => {
    return (
        <div className="flex gap-2 pb-2">
            <Button variant="outline" className="space-x-1">
                <IconUserPlus size={18} />
                <span>New Staff</span>
            </Button>
        </div>
    );
};
