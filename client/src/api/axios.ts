import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const createApiClient = (): AxiosInstance => {
    const apiClient = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        timeout: 10000,
    });

    apiClient.interceptors.request.use(
        (config) => {
            const token = Cookies.get(ACCESS_TOKEN_KEY);

            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

                    if (!refreshToken) {
                        handleLogout();
                        return Promise.reject(error);
                    }

                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    setAuthTokens(accessToken, newRefreshToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    }

                    return apiClient(originalRequest);
                } catch (refreshError) {
                    handleLogout();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return apiClient;
};

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
    const accessTokenExpires = 1;
    const refreshTokenExpires = 30;

    Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        expires: accessTokenExpires,
        secure: import.meta.env.PROD,
        sameSite: 'strict'
    });

    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
        expires: refreshTokenExpires,
        secure: import.meta.env.PROD,
        sameSite: 'strict'
    });
};

export const handleLogout = (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);

    window.location.href = '/login';
};

const apiClient = createApiClient();

export default apiClient;
