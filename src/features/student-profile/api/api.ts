import { apiEndpoints } from '@/config/api-endpoints';
import { api } from '@/lib/api-client';
import { tryCatch } from '@/utils/try-catch';
import { ReportResponse } from '../types/types';

export const getAllStudents = async (
    limit: number = 10,
    offset: number = 0,
    search: string = '',
    status: string = '',
): Promise<ReportResponse> => {
    console.log(status);
    // console the endpoint
    console.log(
        `${apiEndpoints.studentList}?limit=${limit}&offset=${offset}${search ? `&search=${search}` : ''}${status ? `&profile_verified=${status}` : ''}`,
    );
    const { data, error } = await tryCatch(async () => {
        const response = await api.get<ReportResponse>(
            `${apiEndpoints.studentList}?limit=${limit}&offset=${offset}${search ? `&search=${search}` : ''}${status ? `&profile_verified=${status}` : ''}`,
        );
        return response.data;
    });
    console.log(data);
    if (error) {
        throw error;
    }

    return data!;
};
