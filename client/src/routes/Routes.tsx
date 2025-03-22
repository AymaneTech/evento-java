import { Suspense } from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from "../store/auth.store.ts";
import { adminRoutes, protectedRoutes, publicRoutes } from "./routes.config.ts";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    <span className="ml-2">Loading...</span>
  </div>
);

const ProtectedRoute = ({
  element,
  roles = []
}: {
  element: React.ReactElement,
  roles?: string[]
}) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && user) {
    const userRoleName = user.role.name;
    const hasRequiredRole = roles.includes(userRoleName);

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return element;
};

export const Routes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterRoutes>
        {publicRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}

        {protectedRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute element={<route.component />} />
            }
          />
        ))}

        {adminRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute
                element={<route.component />}
                roles={['ADMIN']}
              />
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </RouterRoutes>
    </Suspense>
  );
};
