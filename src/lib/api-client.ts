import Axios, { InternalAxiosRequestConfig } from 'axios';
import { paths } from '../config/paths';
import { QueryClient } from '@tanstack/react-query';
import { tokenStorage } from './token';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (config.headers) {
        config.headers.Accept = 'application/json';
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (!config.headers['Content-Type']) {
            config.headers['Content-Type'] = 'application/json';
        }
    }
    return config;
}

export const api = Axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // const message = error.response?.data?.non_field_errors?.[0] || error.message;
        // toast.error(message);

        if (error.response?.status === 401) {
            // If we have a refresh token, try to refresh the access token
            if (tokenStorage.isRefreshTokenValid()) {
                try {
                    const response = await api.post('/api/token/refresh/', {
                        refresh: tokenStorage.getRefreshToken(),
                    });
                    tokenStorage.setTokens(response.data);
                    // Retry the original request
                    const config = error.config;
                    config.headers.Authorization = `Bearer ${tokenStorage.getAccessToken()}`;
                    return api(config);
                } catch (refreshError) {
                    // If refresh fails, clear tokens and redirect to login
                    tokenStorage.clearTokens();
                    const searchParams = new URLSearchParams();
                    const redirectTo = searchParams.get('redirectTo') || window.location.pathname;
                    window.location.href = paths.auth.login.getHref(redirectTo);
                }
            } else {
                // No valid refresh token, redirect to login
                tokenStorage.clearTokens();
                const searchParams = new URLSearchParams();
                const redirectTo = searchParams.get('redirectTo') || window.location.pathname;
                window.location.href = paths.auth.login.getHref(redirectTo);
            }
        }

        return Promise.reject(error);
    },
);

export const queryClient = new QueryClient();
