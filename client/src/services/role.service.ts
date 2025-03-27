import apiClient from '../api/axios';
import { RoleRequestDto, RoleResponseDto } from '../types/role.types';

const API_PATH = '/v1/roles';

export const RoleService = {
  createRole: async (roleData: RoleRequestDto): Promise<RoleResponseDto> => {
    const response = await apiClient.post<RoleResponseDto>(API_PATH, roleData);
    return response.data;
  },

  getRoleById: async (id: number): Promise<RoleResponseDto> => {
    const response = await apiClient.get<RoleResponseDto>(`${API_PATH}/${id}`);
    return response.data;
  },

  getAllRoles: async (): Promise<RoleResponseDto[]> => {
    const response = await apiClient.get<RoleResponseDto[]>(API_PATH);
    return response.data;
  },

  updateRole: async (id: number, roleData: RoleRequestDto): Promise<RoleResponseDto> => {
    const response = await apiClient.put<RoleResponseDto>(`${API_PATH}/${id}`, roleData);
    return response.data;
  },

  deleteRole: async (id: number): Promise<void> => {
    await apiClient.delete(`${API_PATH}/${id}`);
  }
};
