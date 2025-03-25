import { lazy } from "react";
import AdminLayout from "../layout/admin-layout.tsx";

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
  children?: RouteConfig[];
  roles?: string[];
}

const Home = lazy(() => import("../Home"));
const Login = lazy(() => import("../pages/auth/Login.page.tsx"));
const Register = lazy(() => import("../pages/auth/Register.page.tsx"));
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword.page.tsx"));
const RegistrationSuccess = lazy(() => import("../pages/auth/RegistrationSuccess.page.tsx"));
const CategoriesList = lazy(() => import("../pages/admin/category/categories-list.tsx"));
const EventList = lazy(() => import("../pages/admin/event/event-list.tsx"));
const Profile = lazy(() => import("../pages/profile/profile.page.tsx"))
const UserList = lazy(() => import("../pages/admin/user/user-list.page.tsx"))


const NotFound = lazy(() => import("../pages/error/NotFound.page.tsx"));
const Unauthorized = lazy(() => import("../pages/error/Unauthorized.page.tsx"));

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
    path: "/profile",
    component: Profile,
  },
  {
    path: "*",
    component: NotFound,
  },
  {
    path: "/unauthorized",
    component: Unauthorized,
  },
  {
    path: "registeration-success",
    component: RegistrationSuccess,
  },
  {
    path: "dashboard",
    component: AdminLayout,
    children: [
      {
        path: "categories",
        component: CategoriesList,
      },
      {
        path: "events",
        component: EventList,
      },
      {
        path: "users",
        component: UserList
      }
    ],
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: "/change-password",
    component: ChangePassword,
    protected: true,
  },
];

export const adminRoutes: RouteConfig[] = [];

export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
];
