export interface RoleRequestDto {
  name: string;
}

export interface RoleResponseDto {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  label: string;
}
