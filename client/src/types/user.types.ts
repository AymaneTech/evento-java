export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  DELETED = "DELETED",
}

export interface NestedRole {
  id: number
  name: string
}

export interface User {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
}

export interface UserResponseDto {
  id: number
  firstName: string
  lastName: string
  email: string
  status?: UserStatus
  role: NestedRole
}

export interface UpdateUserRequestDto {
  firstName: string
  lastName: string
  email: string
  roleId: number
}
