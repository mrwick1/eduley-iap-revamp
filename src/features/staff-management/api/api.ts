import { apiEndpoints } from '@/config/api-endpoints';
import { tryCatch } from '@/utils/try-catch';
import { StaffResponse } from '../types/types';
import { api } from '@/lib/api-client';
import { ROLE_NAMES } from '@/const/role';
import { StaffFormValues } from '../schema/schema';

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

export const createStaff = async (values: StaffFormValues) => {
    const { data, error } = await tryCatch(async () => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'groups' && Array.isArray(value)) {
                    value.forEach((groupItem) => formData.append(key, String(groupItem)));
                } else if (key === 'profile_photo') {
                    if (value instanceof File) {
                        formData.append(key, value as Blob);
                    }
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        formData.append('is_active', 'true');

        const response = await api.post(apiEndpoints.staffList, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    });
    if (error) {
        throw error;
    }
    return data;
};

export const updateStaff = async (id: string, values: StaffFormValues) => {
    const { data, error } = await tryCatch(async () => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'groups' && Array.isArray(value)) {
                    value.forEach((groupItem) => formData.append(key, String(groupItem)));
                } else if (key === 'profile_photo') {
                    if (value instanceof File) {
                        formData.append(key, value as Blob);
                    }
                } else {
                    formData.append(key, String(value));
                }
            }
        });
        const response = await api.put(`${apiEndpoints.staffList}${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    });
    if (error) {
        throw error;
    }
    return data;
};

export const deleteStaff = async (id: string) => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.delete(`${apiEndpoints.staffList}${id}/`);
        return response.data;
    });
    if (error) {
        throw error;
    }
    return data;
};

export const updateStaffStatus = async (id: string, isActive: boolean) => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.patch(`${apiEndpoints.staffList}${id}/`, { is_active: isActive });
        return response.data;
    });
    if (error) {
        throw error;
    }
    return data;
};
