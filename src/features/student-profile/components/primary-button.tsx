import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { IconDownload } from '@tabler/icons-react';
import useExcelDownload from '@/hooks/use-excel-downlaod';
import { apiEndpoints } from '@/config/api-endpoints';
import { useStudentProfile } from '../context/student-profile-context';

export const StudentProfilePrimaryButtons = () => {
    const { filter } = useStudentProfile();
    const { downloadExcel, isDownloading } = useExcelDownload();

    const handleDownloadExcel = async () => {
        await downloadExcel({
            endpoint: apiEndpoints.studentProfileDownloadExcel,
            queryParams: {
                search: filter.search,
                profile_verified: filter.status === 'all' || !filter.status ? '' : filter.status,
            },
            filenamePrefix: 'Student Profile',
            filenameFilters: [
                filter.status === 'all' || !filter.status ? '' : filter.status,
                filter.search ? filter.search : '',
            ].filter(Boolean),
            excludeFields: ['subscriptions', 'gamification_details'],
        });
    };

    return (
        <div className="flex gap-2 pb-2">
            <Button
                variant="outline"
                className="space-x-1"
                onClick={handleDownloadExcel}
                disabled={isDownloading}
                infoMessage="Export all student's data in excel format"
            >
                <span>Export Excel</span>
                {isDownloading ? <Spinner size="sm" /> : <IconDownload size={18} />}
            </Button>
        </div>
    );
};
