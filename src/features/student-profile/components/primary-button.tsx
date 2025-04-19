import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { IconDownload } from '@tabler/icons-react';

export const StudentProfilePrimaryButtons = ({
    isDownloading,
    handleDownloadExcel,
}: {
    isDownloading: boolean;
    handleDownloadExcel: () => void;
}) => {
    return (
        <div className="flex gap-2 pb-2">
            <Button variant="outline" className="space-x-1" onClick={handleDownloadExcel} disabled={isDownloading}>
                <span>Export Excel</span>
                {isDownloading ? <Spinner size="sm" /> : <IconDownload size={18} />}
            </Button>
        </div>
    );
};
