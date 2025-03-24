import { create } from "zustand";
import { RoleService } from "../services/role.service";
import type { Role, RoleRequestDto, RoleResponseDto } from "../types/role.types";

interface RoleState {
  roles: Role[];
  selectedRole: Role | null;
  isLoading: boolean;
  error: string | null;

  fetchAllRoles: () => Promise<void>;
  fetchRoleById: (id: number) => Promise<void>;
  createRole: (roleData: RoleRequestDto) => Promise<void>;
  updateRole: (id: number, roleData: RoleRequestDto) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  setSelectedRole: (role: Role | null) => void;
  clearError: () => void;
}

export const useRoleStore = create<RoleState>((set, get) => ({
  roles: [],
  selectedRole: null,
  isLoading: false,
  error: null,

  fetchAllRoles: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await RoleService.getAllRoles();
      const roles: Role[] = response.map((r: RoleResponseDto) => mapToRole(r));
      set({ roles, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch roles",
      });
    }
  },

  fetchRoleById: async (roleId) => {
    try {
      set({ isLoading: true, error: null });
      const response = await RoleService.getRoleById(roleId);
      set({ selectedRole: mapToRole(response), isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to fetch role with ID: ${roleId}`,
      });
    }
  },

  createRole: async (roleData) => {
    try {
      set({ isLoading: true, error: null });
      const newRole = await RoleService.createRole(roleData);
      set(state => ({
        roles: [...state.roles, mapToRole(newRole)],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to create role",
      });
      throw error;
    }
  },

  updateRole: async (id, roleData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await RoleService.updateRole(id, roleData);
      const role = mapToRole(response);
      set(state => ({
        roles: state.roles.map(role => role.id === id ? role : role),
        selectedRole: state.selectedRole?.id === id ? role : state.selectedRole,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to update role with ID: ${id}`,
      });
      throw error;
    }
  },

  deleteRole: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await RoleService.deleteRole(id);
      set(state => ({
        roles: state.roles.filter(role => role.id !== id),
        selectedRole: state.selectedRole?.id === id ? null : state.selectedRole,
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : `Failed to delete role with ID: ${id}`,
      });
      throw error;
    }
  },

  setSelectedRole: (role) => {
    set({ selectedRole: role });
  },

  clearError: () => {
    set({ error: null });
  },
}));

const generateLabel = (name: string) => name.replace(/^ROLE_/, "").toLowerCase();

const mapToRole = ({ id, name }: RoleResponseDto) => ({ id, name, label: generateLabel(name) });

