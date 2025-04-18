import { apiEndpoints } from '@/config/api-endpoints';
import { api } from '@/lib/api-client';
import { tryCatch } from '@/utils/try-catch';
import { StudentProfile } from '../types/types';

export const getAllStudents = async (): Promise<StudentProfile[]> => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.get<StudentProfile[]>(apiEndpoints.studentList);
        return response.data;
    });

    if (error) {
        throw error;
    }

    return data!;
};
