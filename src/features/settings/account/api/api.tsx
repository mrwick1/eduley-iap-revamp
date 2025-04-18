import { apiEndpoints } from '@/config/api-endpoints';
import { api } from '@/lib/api-client';
import { Role } from '../types/types';
import { User } from '@/store/userSlice';
import { ApiFnReturnType } from '@/lib/react-query';
import { tryCatch } from '@/utils/try-catch';

// Type aliases for API function return types
export type GetRolesReturnType = ApiFnReturnType<typeof getRoles>;
export type GetUserReturnType = ApiFnReturnType<typeof getUser>;
export type UpdateUserReturnType = ApiFnReturnType<typeof updateUser>;

export const getRoles = async (): Promise<Role[]> => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.get<Role[]>(apiEndpoints.roles);
        return response.data;
    });

    if (error) {
        throw error;
    }

    return data!;
};

export const getUser = async (id: number): Promise<User> => {
    const { data, error } = await tryCatch(async () => {
        const response = await api.get<User>(apiEndpoints.iapUser.replace(':id', id.toString()));
        return response.data;
    });

    if (error) {
        throw error;
    }

    return data!;
};

export const updateUser = async (id: number, user: User): Promise<User> => {
    const { data, error } = await tryCatch(async () => {
        const formData = new FormData();
        Object.entries(user).forEach(([key, value]) => {
            if (key === 'groups' && Array.isArray(value)) {
                // Convert group IDs to numbers and append each one
                value.forEach((groupId) => {
                    formData.append('groups', String(Number(groupId)));
                });
            } else if (key === 'profile_photo') {
                // Only append profile_photo if it's a File object
                if (value instanceof File) {
                    formData.append(key, value);
                }
            } else {
                formData.append(key, value);
            }
        });

        const response = await api.put<User>(apiEndpoints.iapUser.replace(':id', id.toString()), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    });

    if (error) {
        throw error;
    }

    return data!;
};
