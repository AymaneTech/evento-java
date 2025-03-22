import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
}

const Home = lazy(() => import('../Home'));
const Login = lazy(() => import("../pages/auth/Login.page.tsx"))
const Register = lazy(() => import("../pages/auth/Register.page.tsx"))
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword.page.tsx"))

const NotFound = lazy(() => import("../pages/error/NotFound.page.tsx"))
const Unauthorized = lazy(() => import("../pages/error/Unauthorized.page.tsx"))

export const publicRoutes: RouteConfig[] = [
  {
    path: "",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "*",
    component: NotFound,
  },
  {
    path: "/unauthorized",
    component: Unauthorized,
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: "/change-password",
    component: ChangePassword,
    protected: true,
  },
];

export const adminRoutes: RouteConfig[] = [
];

export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
];
