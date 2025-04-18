import { configureAuth } from 'react-query-auth';
import { z } from 'zod';
import { api } from './api-client';
import { User, useUserStore } from '../store/userSlice';
import { useStore } from '../store';
import { TokenType, tokenStorage } from './token';
import { apiEndpoints } from '@/config/api-endpoints';
import { Navigate } from '@tanstack/react-router';
import React from 'react';
import { tryCatch } from '@/utils/try-catch';
import { useInstituteStore } from '../store/instituteSlice';

// Zod schema for login input validation
const loginInputSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z.string().min(1, 'Please enter your password'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

/**
 * Get the user from the API
 * @returns {Promise<User | null>} The user or null if the user is not found
 */
const getUser = async (): Promise<User | null> => {
    try {
        if (!tokenStorage.isAccessTokenValid()) {
            if (tokenStorage.isRefreshTokenValid()) {
                try {
                    const response = await api.post(apiEndpoints.refresh, {
                        refresh: tokenStorage.getRefreshToken(),
                    });
                    tokenStorage.setTokens(response.data);
                } catch (error) {
                    tokenStorage.clearTokens();
                    useUserStore.getState().setUser(null);
                    useUserStore.getState().setAuthenticated(false);
                    useInstituteStore.getState().setInstitute(null);
                    return null;
                }
            } else {
                tokenStorage.clearTokens();
                useUserStore.getState().setUser(null);
                useUserStore.getState().setAuthenticated(false);
                useInstituteStore.getState().setInstitute(null);
                return null;
            }
        }

        const [userResponse, instituteResponse] = await Promise.all([
            api.get(apiEndpoints.user),
            api.get(apiEndpoints.institute),
        ]);

        const user = userResponse.data?.[0];
        const institute = instituteResponse.data?.[0];

        useUserStore.getState().setUser(user);
        useUserStore.getState().setAuthenticated(true);
        useInstituteStore.getState().setInstitute(institute);

        return user;
    } catch (error) {
        useUserStore.getState().setUser(null);
        useUserStore.getState().setAuthenticated(false);
        useInstituteStore.getState().setInstitute(null);
        return null;
    }
};

/**
 * Login the user
 * @param {LoginInput} data - The login data
 * @returns {Promise<User>}  the token
 */

const login = async (data: LoginInput): Promise<User> => {
    try {
        const { data: tokenData, error } = await tryCatch<TokenType>(async () => {
            const response = await api.post<TokenType>(apiEndpoints.login, data);
            return response.data;
        });

        if (error) {
            throw error;
        }
        if (!tokenData) {
            throw new Error('No token data received');
        }
        tokenStorage.setTokens(tokenData);

        // Fetch user data after successful login
        const userResponse = await api.get(apiEndpoints.user);
        const user = userResponse.data?.[0];
        useUserStore.getState().setUser(user);
        useUserStore.getState().setAuthenticated(true);

        return user;
    } catch (error) {
        throw error;
    }
};

/**
 * Logout the user
 * @returns {Promise<void>} The void
 */
const logout = async (): Promise<void> => {
    try {
        // await api.post(apiEndpoints.logout);
        // fake logout promise
        await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
        tokenStorage.clearTokens();
        useStore.getState().reset();
    }
};

const register = async (): Promise<User | null> => {
    return null;
};

// Configure auth
export const { useUser, useLogin, useLogout, AuthLoader } = configureAuth({
    userFn: getUser,
    loginFn: login,
    logoutFn: logout,
    registerFn: register,
});

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useUserStore();

    if (!isAuthenticated && !isLoading) {
        return <Navigate to="/auth/login" />;
    }
    return children;
};
