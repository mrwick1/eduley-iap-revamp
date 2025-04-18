import { jwtDecode } from 'jwt-decode';

export interface TokenType {
    refresh: string;
    access: string;
    domain: string;
}

interface TokenPayload {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
}

export const tokenStorage = {
    setTokens: (tokens: TokenType) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('domain', tokens.domain);
    },

    getAccessToken: () => localStorage.getItem('access_token'),
    getRefreshToken: () => localStorage.getItem('refresh_token'),
    getDomain: () => localStorage.getItem('domain'),

    clearTokens: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('domain');
    },

    isAccessTokenValid: () => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    isRefreshTokenValid: () => {
        const token = localStorage.getItem('refresh_token');
        if (!token) return false;

        try {
            const decoded = jwtDecode<TokenPayload>(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },
};
