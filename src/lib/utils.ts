import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from './api-client';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Downloads a file from the server.
 *
 * @param {string} url - The API endpoint URL.
 * @param {string} filename - The desired filename for the downloaded file.
 */
export const handleDownload = async (url: string, filename: string = 'download'): Promise<void> => {
    try {
        const response = await api.get(url, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error(`Unexpected response status: ${response.status}`);
        }

        const contentType =
            response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        const blob = new Blob([response.data], { type: contentType });
        const urlBlob = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = urlBlob;
        a.download = `${filename}`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
        console.error('Error downloading the file:', error);
    }
};

/**
 * Generates a sanitized filename with timestamp
 *
 * @param tableName - The base name for the file
 * @param filterValues - Array of values to include in the filename
 * @param extension - The file extension (default: 'xlsx')
 * @returns A sanitized filename with timestamp
 */
export function generateFilename(
    tableName: string,
    filterValues: (string | number | boolean | undefined | null)[],
    extension: string = 'xlsx',
): string {
    const sanitize = (str: string | number | boolean | undefined | null): string =>
        String(str)
            .trim()
            .replace(/[^a-zA-Z0-9_\-]/g, '_');

    const sanitizedTableName = sanitize(tableName);

    const filterString = filterValues
        .filter((value) => value !== '' && value !== undefined && value !== null)
        .map(sanitize)
        .join('_');

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(
        now.getHours(),
    ).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;

    const filename = `${sanitizedTableName}${filterString ? `_${filterString}` : ''}_${timestamp}.${extension}`;

    return filename;
}
