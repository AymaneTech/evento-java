import { getUserData, isAuthenticated, getUserRole } from "./jwt.util"
import Cookies from "js-cookie"

/**
 * Debug utility to log authentication state
 * This can be called from any component to help diagnose auth issues
 */
export function debugAuthState(location = "unknown"): void {
  if (process.env.NODE_ENV !== "production") {
    console.group(`Auth Debug (${location})`)
    console.log("Is Authenticated:", isAuthenticated())
    console.log("User Role:", getUserRole())

    const userData = getUserData()
    console.log("User Data:", userData)

    // Check cookies
    const accessToken = Cookies.get("access_token")
    const refreshToken = Cookies.get("refresh_token")
    console.log("Access Token:", accessToken ? "Present" : "Missing")
    console.log("Refresh Token:", refreshToken ? "Present" : "Missing")

    // Check if token is expired
    if (accessToken) {
      try {
        const tokenData = JSON.parse(atob(accessToken.split(".")[1]))
        const expiryTime = tokenData.exp * 1000
        const now = Date.now()
        console.log("Token expires at:", new Date(expiryTime).toLocaleString())
        console.log("Token expired:", expiryTime < now)
        console.log("Time until expiry:", Math.floor((expiryTime - now) / 1000), "seconds")
      } catch (e) {
        console.log("Error parsing token:", e)
      }
    }

    console.groupEnd()
  }
}


