import { RegisterResponse } from '../core/dto/response/auth/RegisterResponse';
import { api } from "@/libs/configuration";
import { AuthRequest, RegisterRequest } from "../core/dto/request";
import { AccountResponse, ApiResponse, AuthResponse, MyInfoResponse } from "../core/dto/response";
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../utils';
import Cookies from 'js-cookie';

export const login = async (
    authRequest: AuthRequest
): Promise<ApiResponse<AuthResponse>> => {
    console.log(authRequest);
    
    try {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/login",
            authRequest
        );

        if (!response.data) {
            throw new Error("No data received in response");
        }
        const result = response.data.result;

        console.log(result);
        

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

export const logout = () => {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
}

export const getMyInfo = async (): Promise<ApiResponse<MyInfoResponse>> => {
    try {
        const response = await api.get<ApiResponse<MyInfoResponse>>(
            "/auth/me"
        );

        console.log(response.data);
        
        return response.data;
    } catch (error) {
        throw error;
    }   
}
