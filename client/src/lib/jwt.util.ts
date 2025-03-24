import { jwtDecode } from "jwt-decode"
import Cookies from "js-cookie"

// Types
interface JwtPayload {
  id?: { value: string }
  sub?: string
  email?: string
  name?: {
    firstName: string
    lastName: string
  }
  authorities?: string[]
  exp?: number
}

export interface UserData {
  id: string
  email: string
  firstName?: string
  lastName?: string
  fullName?: string
  authorities: string[]
}

// Constants
const USER_DATA_KEY = "user_data"
const COOKIE_OPTIONS = {
  sameSite: "strict" as const,
  expires: 7,
  secure: process.env.NODE_ENV === "production",
}

/**
 * Decode JWT token and return its payload
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token)
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

/**
 * Store user information from token in a single cookie
 */
export function storeUserInfoFromToken(token: string): void {
  const decoded = decodeToken(token)
  if (!decoded) return

  const firstName = decoded.name?.firstName || ""
  const lastName = decoded.name?.lastName || ""

  const userData: UserData = {
    id: decoded.id?.value || decoded.sub || "",
    email: decoded.email || "",
    firstName,
    lastName,
    fullName: firstName && lastName ? `${firstName} ${lastName}` : undefined,
    authorities: decoded.authorities || [],
  }

  saveUserData(userData)
}

/**
 * Save user data to a single cookie and sessionStorage
 */
export function saveUserData(userData: UserData): void {
  if (!userData) return

  // Store in sessionStorage for quick access
  sessionStorage.setItem("user", JSON.stringify(userData))

  // Store in a single cookie
  Cookies.set(USER_DATA_KEY, JSON.stringify(userData), COOKIE_OPTIONS)
}

/**
 * Get user data from sessionStorage or cookie
 */
export function getUserData(): UserData | null {
  // Try to get from sessionStorage first (faster)
  const userJson = sessionStorage.getItem("user")
  if (userJson) {
    return JSON.parse(userJson)
  }

  // Fall back to cookie
  const cookieData = Cookies.get(USER_DATA_KEY)
  if (!cookieData) return null

  try {
    const userData = JSON.parse(cookieData)
    // Restore to sessionStorage for future quick access
    sessionStorage.setItem("user", cookieData)
    return userData
  } catch (error) {
    console.error("Error parsing user data from cookie:", error)
    return null
  }
}

/**
 * Clear user data from both sessionStorage and cookie
 */
export function clearUserData(): void {
  sessionStorage.removeItem("user")
  Cookies.remove(USER_DATA_KEY)
}

/**
 * Get user ID
 */
export function getUserId(): string {
  const userData = getUserData()
  return userData?.id || ""
}

/**
 * Get user email
 */
export function getUserEmail(): string {
  const userData = getUserData()
  return userData?.email || ""
}

/**
 * Get user full name
 */
export function getUserFullName(): string {
  const userData = getUserData()
  if (userData?.fullName) return userData.fullName

  const firstName = userData?.firstName || ""
  const lastName = userData?.lastName || ""
  return firstName && lastName ? `${firstName} ${lastName}` : ""
}

/**
 * Get user role (first authority)
 */
export function getUserRole(): string {
  const userData = getUserData()
  return userData?.authorities?.[0] || ""
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const userData = getUserData()
  if (!userData || !userData.authorities) return false
  return userData.authorities.includes(role)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const userData = getUserData()
  return !!userData && !!userData.id
}

/**
 * Determine redirect path based on user role
 */
export function getRedirectPathByRole(): string {
  const userData = getUserData()
  if (!userData || !userData.authorities || !userData.authorities.length) {
    return "/"
  }

  if (userData.authorities.includes("ROLE_ADMIN") || userData.authorities.includes("ADMIN")) {
    return "/admin/dashboard"
  } else if (userData.authorities.includes("ROLE_ORGANIZER") || userData.authorities.includes("ORGANIZER")) {
    return "/organizer/dashboard"
  } else if (userData.authorities.includes("ROLE_USER") || userData.authorities.includes("USER")) {
    return "/"
  }

  return "/"
}


