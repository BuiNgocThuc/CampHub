export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    authenticated: boolean;
    expiresIn: number;
}