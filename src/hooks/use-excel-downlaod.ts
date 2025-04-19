import { useState } from 'react';
import { generateFilename, handleDownload } from '../lib/utils';

interface DownloadExcelParams {
    endpoint: string;
    queryParams?: Record<string, string | number | boolean | undefined>;
    filenamePrefix: string;
    filenameFilters?: (string | number | boolean | undefined)[];
    excludeFields?: string[];
}

interface UseExcelDownloadReturn {
    isDownloading: boolean;
    downloadExcel: (params: DownloadExcelParams) => Promise<void>;
}

const useExcelDownload = (): UseExcelDownloadReturn => {
    const [isDownloading, setIsDownloading] = useState(false);

    const downloadExcel = async ({
        endpoint,
        queryParams = {},
        filenamePrefix,
        filenameFilters = [],
        excludeFields = [],
    }: DownloadExcelParams): Promise<void> => {
        try {
            setIsDownloading(true);

            // Construct query string from queryParams
            const queryString = Object.entries(queryParams)
                .filter(([_, value]) => value !== undefined && value !== '')
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            // Add exclude fields if provided
            const excludeFieldsQuery = excludeFields.map((field) => `exclude_fields=${field}`).join('&');

            // Combine all query parameters
            const finalQuery = [queryString, excludeFieldsQuery].filter(Boolean).join('&');

            // Generate the full URL
            const url = `${endpoint}${finalQuery ? `?${finalQuery}` : ''}`;

            // Generate filename
            const filename = generateFilename(filenamePrefix, filenameFilters);

            // Handle the download
            await handleDownload(url, filename);
        } catch (error) {
            console.error('Error downloading Excel:', error);
            throw error;
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        isDownloading,
        downloadExcel,
    };
};

export default useExcelDownload;
