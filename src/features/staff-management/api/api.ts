import { apiEndpoints } from '@/config/api-endpoints';
import { tryCatch } from '@/utils/try-catch';
import { StaffResponse } from '../types/types';
import { api } from '@/lib/api-client';
import { ROLE_NAMES } from '@/const/role';

export const getAllStaff = async (
    limit: number = 10,
    offset: number = 0,
    search: string = '',
    is_active: string = '',
    groups__name: string = '',
    ordering: string = '',
) => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.get<StaffResponse>(
            `${apiEndpoints.staffList}?limit=${limit}&offset=${offset}${search ? `&search=${search}` : ''}${is_active ? `&is_active=${is_active[0] === 'active' ? 'true' : 'false'}` : ''}${groups__name ? `&groups__name=${ROLE_NAMES[Number(groups__name)]}` : ''}${ordering ? `&ordering=${ordering}` : ''}`,
        );
        return response.data;
    });
    if (error) {
        throw error;
    }
    return data;
};
