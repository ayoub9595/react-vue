import type { AuthRequest, AuthResponse, RefreshTokenRequest } from '../types/auth';

const url = 'http://localhost:8080/api/auth/';

export const authenticate = async(authRequest: AuthRequest): Promise<AuthResponse> => {
    const response = await fetch(`${url}authenticate`, {
        method: 'POST',
        body: JSON.stringify(authRequest),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message)
    }
    return data;
}

export const refreshToken = async(refreshRequest: RefreshTokenRequest): Promise<AuthResponse> => {
    const response = await fetch(`${url}refresh`, {
        method: 'POST',
        body: JSON.stringify(refreshRequest),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const data = await response.json();
    if(!response.ok) {
        throw new Error(data.message)
    }
    return data;
}