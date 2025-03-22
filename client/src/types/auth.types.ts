export interface RegisterNewUserRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UserLoginRequestDto {
  email: string;
  password: string;
}

export interface ChangePasswordRequestDto {
  oldPassword: string;
  newPassword: string;
}

export interface UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticationResponseDto {
  token: string;
  refreshToken: string;
  user: UserResponseDto;
}
