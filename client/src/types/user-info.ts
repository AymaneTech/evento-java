import { useMemo } from "react";
import {
  getUserData,
  getUserEmail,
  getUserFullName,
  getUserId,
  getUserRole,
  hasRole,
  type UserData,
} from "../lib/jwt.util";

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isAdmin: boolean;
  isOrganizer: boolean;
  isUser: boolean;
  hasRole: (role: string) => boolean;
  userData: UserData | null;
}

/**
 * Hook to provide user information from stored data
 */
export function useUserInfo(): UserInfo {
  return useMemo(() => {
    const userData = getUserData();
    const id = getUserId();
    const fullName = getUserFullName();
    const email = getUserEmail();
    const role = getUserRole();

    return {
      id,
      fullName,
      email,
      role,
      isAdmin: hasRole("ROLE_ADMIN") || hasRole("ADMIN"),
      isOrganizer: hasRole("ROLE_ORGANIZER") || hasRole("ORGANIZER"),
      isUser: hasRole("ROLE_USER") || hasRole("USER"),
      hasRole,
      userData,
    };
  }, []);
}


