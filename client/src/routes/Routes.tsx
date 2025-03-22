import type React from "react"
import { Suspense } from "react"
import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom"
import { useApi } from "../api/hooks"
import { adminRoutes, protectedRoutes, publicRoutes } from "./routes.config"
import type { UserResponseDto } from "../types/auth.types"

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
  const {
    data: user,
    loading,
    error,
  } = useApi<UserResponseDto>("/auth/me", {
    onError: () => {
      console.log("Authentication check failed")
    },
  })

  if (loading) {
    return <LoadingFallback />
  }

  if (error || !user) {
    return <Navigate to="/login" replace />
  }

  if (roles.length > 0) {
    const userRoleName = user.role.name
    const hasRequiredRole = roles.includes(userRoleName)

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />
    }
  }

  return element
}

export const Routes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.component />} />
        ))}

        {protectedRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={<ProtectedRoute element={<route.component />} />} />
        ))}

        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<ProtectedRoute element={<route.component />} roles={["ADMIN"]} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </RouterRoutes>
    </Suspense>
  )
}

