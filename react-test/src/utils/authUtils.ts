import { AuthResponse } from "../types/auth";

export const setAuthTokens = (response: AuthResponse) => {
    localStorage.setItem('userId', response.id);
    localStorage.setItem('userEmail', response.email);
    localStorage.setItem('userRole', response.role);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
};

export const clearAuthTokens = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');