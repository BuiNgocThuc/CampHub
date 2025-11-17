import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../utils';
import { RefreshTokenRequest } from '../core/dto/request';
import { RefreshTokenResponse } from '../core/dto/response';


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Interceptor: tự động thêm JWT nếu đã lưu
api.interceptors.request.use((config) => {
    const token = Cookies.get(ACCESS_TOKEN);
    if (token) {
        config.headers!["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

type QueueItem = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null) => {
    refreshQueue.forEach((item) => {
        if (error) item.reject(error);
        else if (token) item.resolve(token);
    });
    refreshQueue = [];
};

// Interceptor: tự động refresh token nếu hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        const isUnauthorized = error.response?.status === 401;

        if (!isUnauthorized || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // Nếu đang refresh → push vào queue và chờ
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            }).then((newToken) => {
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newToken}`,
                };
                return api(originalRequest);
            });
        }
        
        isRefreshing = true;

        try {
            const refreshToken = Cookies.get(REFRESH_TOKEN);
            if (!refreshToken) throw new Error("Missing refresh token");

            const req: RefreshTokenRequest = { refreshToken };
            const res = await axios.post(`${BASE_URL}/auth/refresh-token`, req);

            const result: RefreshTokenResponse = res.data.result;
            const newAccessToken = result.accessToken;

            Cookies.set(ACCESS_TOKEN, newAccessToken, {
                expires: result.expiresIn / 86400,
            });

            api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);

            originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newAccessToken}`,
            };

            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);

            Cookies.remove(ACCESS_TOKEN);
            Cookies.remove(REFRESH_TOKEN);

            if (typeof window !== "undefined") {
                window.location.href = "/auth/login";
            }

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);
export default api;