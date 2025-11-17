export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    isAuthenticated: boolean;
    expiresIn: number;
}