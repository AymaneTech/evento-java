import apiClient, { setAuthTokens, handleLogout } from '../api/axios';
import type {
  RegisterNewUserRequestDto,
  UserLoginRequestDto,
  ChangePasswordRequestDto,
  AuthenticationResponseDto,
  UserResponseDto
} from '../types/auth.types';

const API_PATH = '/auth';

export const AuthService = {
  register: async (userData: RegisterNewUserRequestDto): Promise<UserResponseDto> => {
    const response = await apiClient.post<UserResponseDto>(`${API_PATH}/register`, userData);
    return response.data;
  },

  login: async (credentials: UserLoginRequestDto): Promise<AuthenticationResponseDto> => {
    console.log("heere here");

    const response = await apiClient.post<AuthenticationResponseDto>(`${API_PATH}/login`, credentials);
    const { token, refreshToken } = response.data;

    setAuthTokens(token, refreshToken);

    return response.data;
  },

  changePassword: async (passwordData: ChangePasswordRequestDto): Promise<void> => {
    await apiClient.post(`${API_PATH}/change-password`, passwordData);
  },

  logout: (): void => {
    handleLogout();
  }
};
