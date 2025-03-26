
import type React from "react"

import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { isAuthenticated, getUserRole } from "../lib/jwt.util"

interface AuthMiddlewareProps {
  children: React.ReactNode
}

export const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const publicPaths = [
      "/login",
      "/register",
      "/registeration-success",
      "/unauthorized",
      "/not-found",
      "/",
      "/events",
      "/home",
    ]

    if (
      location.pathname === "/login" ||
      location.pathname === "/register" ||
      location.pathname === "/registeration-success"
    ) {
      return
    }

    const isPublicPath = publicPaths.some(
      (path) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path)),
    )

    const isDashboardPath = location.pathname.startsWith("/dashboard")

    const authenticated = isAuthenticated()

    if (!authenticated && !isPublicPath) {
      navigate("/login", { state: { from: location } })
      return
    }

    if (authenticated && isDashboardPath) {
      const role = getUserRole()
      if (role !== "ROLE_ADMIN" && role !== "ROLE_ORGANIZER") {
        navigate("/unauthorized")
      }
    }
  }, [location, navigate])

  return <>{children}</>
}


