export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    id: string;
    accessToken: string;
    refreshToken: string;
    email: string;
    role: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}