import { refreshToken } from "./authenticationService";
import { setAuthTokens, getAccessToken, getRefreshToken } from "../utils/authUtils";
import { User } from "../User";

const BASE_URL = 'http://localhost:8080/api/users/';

const getAuthHeaders = () => {
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let headers = {
        ...getAuthHeaders(),
        ...options.headers
    };

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // If token is expired, try to refresh it
    if (response.status === 401) {
        const refreshTokenStr = getRefreshToken();
        if (refreshTokenStr) {
            try {
                const newTokens = await refreshToken({ refreshToken: refreshTokenStr });
                setAuthTokens(newTokens);
                
                // Retry the original request with new token
                headers = {
                    ...getAuthHeaders(),
                    ...options.headers
                };
                
                response = await fetch(url, {
                    ...options,
                    headers,
                });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // If refresh fails, redirect to login
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }
        }
    }

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
};

// Your existing CRUD operations remain the same
export const getAllUsers = async (): Promise<User[]> => {
    return fetchWithAuth(BASE_URL);
};

export const getUserById = async (id: number): Promise<User> => {
    return fetchWithAuth(`${BASE_URL}${id}`);
};

export const addUser = async (user: User): Promise<User> => {
    return fetchWithAuth(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(user)
    });
};

export const updateUser = async (user: User): Promise<User> => {
    return fetchWithAuth(BASE_URL, {
        method: 'PUT',
        body: JSON.stringify(user)
    });
};

export const deleteUserById = async (id: number): Promise<void> => {
    return fetchWithAuth(`${BASE_URL}${id}`, {
        method: 'DELETE'
    });
};