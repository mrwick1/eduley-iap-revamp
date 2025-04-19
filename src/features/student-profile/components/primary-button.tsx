import { Button } from '@/components/ui/button';
import { IconDownload } from '@tabler/icons-react';

export const StudentProfilePrimaryButtons = () => {
    return (
        <div className="flex gap-2 pb-2">
            <Button variant="outline" className="space-x-1">
                <span>Export Excel</span> <IconDownload size={18} />
            </Button>
        </div>
    );
};
