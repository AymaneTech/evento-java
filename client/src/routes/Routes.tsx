"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import { Routes as RouterRoutes, Route, Navigate, useLocation } from "react-router-dom"
import { adminRoutes, protectedRoutes, publicRoutes } from "./routes.config"
import { isAuthenticated, getUserRole } from "../lib/jwt.util"
import { debugAuthState } from "../lib/debug.util"

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2">Loading...</span>
  </div>
)

const ProtectedRoute = ({
  element,
  roles = [],
}: {
  element: React.ReactElement
  roles?: string[]
}) => {
  const location = useLocation()

  // Debug auth state
  debugAuthState("ProtectedRoute")

  // Check if user is authenticated
  if (!isAuthenticated()) {
    console.log("Not authenticated, redirecting to login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  if (roles.length > 0) {
    const userRole = getUserRole()
    console.log(`Checking role: user has ${userRole}, needs one of:`, roles)

    const hasRequiredRole = roles.includes(userRole)
    if (!hasRequiredRole) {
      console.log("User doesn't have required role, redirecting to unauthorized")
      return <Navigate to="/unauthorized" replace />
    }
  }

  return element
}

// Recursive function to render routes with children
const renderRoutes = (routes: any[], isProtected = false, roles: string[] = []) => {
  return routes
    .map((route) => {
      // Skip direct routes as they're handled separately
      if (route.direct) {
        return null
      }

      // Create the element based on whether it's protected or not
      let routeElement

      if (isProtected || route.protected) {
        routeElement = <ProtectedRoute element={<route.component />} roles={roles.length > 0 ? roles : route.roles} />
      } else {
        routeElement = <route.component />
      }

      // If the route has children, render them as nested routes
      if (route.children && route.children.length > 0) {
        return (
          <Route key={route.path} path={route.path} element={routeElement}>
            {renderRoutes(route.children, isProtected || route.protected, route.roles || roles)}
            {/* Add an index route if needed */}
            {route.index && <Route index element={<route.index />} />}
          </Route>
        )
      }

      // For routes without children
      return <Route key={route.path} path={route.path} element={routeElement} />
    })
    .filter(Boolean) // Filter out null values from direct routes
}

// Get direct routes from all route configs
const getDirectRoutes = () => {
  const allRoutes = [...publicRoutes, ...protectedRoutes, ...adminRoutes]
  return allRoutes.filter((route) => route.direct)
}

export const Routes = () => {
  const location = useLocation()

  // Debug auth state on route change
  useEffect(() => {
    debugAuthState(`Routes component (path: ${location.pathname})`)
  }, [location])

  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {/* Render direct routes first */}
        {getDirectRoutes().map((route) => (
          <Route key={route.path} path={route.path} element={<route.component />} />
        ))}

        {/* Then render all other routes */}
        {renderRoutes(publicRoutes)}
        {renderRoutes(protectedRoutes, true)}
        {renderRoutes(adminRoutes, true)}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </RouterRoutes>
    </Suspense>
  )
}


