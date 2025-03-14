import { interval } from "rxjs";

export enum AuthRole {
  USER = "user",
  ORGANIZER = "organizer",
}

export interface RegisterUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: AuthRole;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface Role {
  id: string;
  name: string;
}
