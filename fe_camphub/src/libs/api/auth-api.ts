import { RegisterResponse } from '../core/dto/response/auth/RegisterResponse';
import { api } from "@/libs/configuration";
import { AuthRequest, RefreshTokenRequest, RegisterRequest } from "../core/dto/request";
import { ApiResponse, AuthResponse, RefreshTokenResponse } from "../core/dto/response";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../utils';
import Cookies from 'js-cookie';

export const login = async (
    authRequest: AuthRequest
): Promise<ApiResponse<AuthResponse>> => {
    try {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/login",
            authRequest
        );

        if (!response.data) {
            throw new Error("No data received in response");
        }
        const result = response.data.result;

        Cookies.set(ACCESS_TOKEN, result.accessToken, {
            expires: result.expiresIn / 86400,
        });

        Cookies.set(REFRESH_TOKEN, result.refreshToken, {
            expires: 7,
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const register = async (
    request: RegisterRequest
): Promise<ApiResponse<RegisterResponse>> => {
    try {
        const response = await api.post<ApiResponse<RegisterResponse>>(
            "/auth/register",
            request
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

// export const refreshToken = async (request: RefreshTokenRequest): Promise<ApiResponse<RefreshTokenResponse>> => {
//     try {
//         const response = await api.post<ApiResponse<RefreshTokenResponse>>(
//             "/auth/refresh-token",
//             request
//         );
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };
