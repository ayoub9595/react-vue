// utils/tokenUtils.ts
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  roles: string;
  userId: number;
  sub: string;
  iat: number; 
  exp: number;
}

export const decodeToken = (token: string): DecodedToken => {
  try {
    return jwtDecode<DecodedToken>(token);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

export const isAdmin = (role: string): boolean => {
  return role === 'ROLE_ADMIN';  // Changed to compare single string
};

export const isCurrentUser = (id: string) => {
  const refreshTokenStr = localStorage.getItem('refreshToken');
  if (!refreshTokenStr) {
    throw new Error('No refresh token found');
  }
  const {userId} = decodeToken(refreshTokenStr);
  return parseInt(id) === userId
}

export const getCurrentUserInfo = (): { isAdmin: boolean, userId: number, email: string } => {
  const refreshTokenStr = localStorage.getItem('refreshToken');
  if (!refreshTokenStr) {
    throw new Error('No refresh token found');
  }

  const decodedToken = decodeToken(refreshTokenStr);
  return {
    isAdmin: isAdmin(decodedToken.roles),
    userId: decodedToken.userId,
    email: decodedToken.sub
  };
};