import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios"
import Cookies from "js-cookie"
import { clearUserData, storeUserInfoFromToken } from "../lib/jwt.util"
import { debugAuthState } from "../lib/debug.util"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
export const ACCESS_TOKEN_KEY = "access_token"
export const REFRESH_TOKEN_KEY = "refresh_token"

const COOKIE_OPTIONS = {
  sameSite: "strict" as const,
  expires: 7,
}

export const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  })

  apiClient.interceptors.request.use(
    (config) => {
      const token = Cookies.get(ACCESS_TOKEN_KEY)
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
        console.log(`Request to ${config.url}: Added auth token`)
      } else {
        console.log(`Request to ${config.url}: No auth token available`)
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log("401 error, attempting token refresh")
        originalRequest._retry = true

        try {
          const refreshToken = Cookies.get(REFRESH_TOKEN_KEY)
          if (!refreshToken) {
            console.log("No refresh token available, logging out")
            handleLogout()
            return Promise.reject(error)
          }

          console.log("Attempting to refresh token")
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })

          console.log("Token refresh response:", response.data)
          const { accessToken, refreshToken: newRefreshToken } = response.data

          setAuthTokens(accessToken, newRefreshToken)
          console.log("Tokens refreshed successfully")

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }
          return apiClient(originalRequest)
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          handleLogout()
          return Promise.reject(refreshError)
        }
      }
      return Promise.reject(error)
    },
  )

  return apiClient
}

export const setAuthTokens = (accessToken: string, refreshToken: string): void => {
  console.log("Setting auth tokens")
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, COOKIE_OPTIONS)
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS)

  // Extract and store user information from the access token
  storeUserInfoFromToken(accessToken)

  // Debug auth state after setting tokens
  debugAuthState("After setting auth tokens")
}

export const handleLogout = (): void => {
  console.log("Logging out, removing tokens")
  Cookies.remove(ACCESS_TOKEN_KEY)
  Cookies.remove(REFRESH_TOKEN_KEY)

  clearUserData()

  // Debug auth state after logout
  debugAuthState("After logout")

  window.location.href = "/login"
}

const apiClient = createApiClient()
export default apiClient


