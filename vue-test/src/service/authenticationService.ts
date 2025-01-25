import { jwtDecode } from 'jwt-decode';
import type { AuthRequest, AuthResponse, RefreshTokenRequest } from '../types/auth';
import { getAccessToken, getRefreshToken, setAuthTokens } from '@/utils/authUtils';

const url = 'http://localhost:8080/api/';

export const authenticate = async(authRequest: AuthRequest): Promise<AuthResponse> => {
    const response = await fetch(`${url}auth/authenticate`, {
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
    const response = await fetch(`${url}auth/refresh`, {
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

let isAuthenticating = false;

export const verifyAuth = async (): Promise<boolean> => {
    const accessToken = getAccessToken();
    const refreshStrToken = getRefreshToken();
  
    if (!accessToken || !refreshToken) return false;
  
    try {
      const decodedToken = jwtDecode<{exp: number}>(accessToken);
      if (decodedToken.exp * 1000 > Date.now()) return true;
      
      if (isAuthenticating) {
        return new Promise(resolve => 
          setTimeout(async () => resolve(await verifyAuth()), 100)
        );
      }
  
      isAuthenticating = true;
      const response = await refreshToken({ refreshToken: refreshStrToken! });
      setAuthTokens(response);
      return true;
    } catch {
      localStorage.clear();
      return false;
    } finally {
      isAuthenticating = false;
    }
  }