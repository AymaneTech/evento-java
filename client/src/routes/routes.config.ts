import type React from "react"
import { lazy } from "react"
import AdminLayout from "../layout/admin-layout.tsx"
import { MainLayout } from "../layout/main-layout.tsx"

export interface RouteConfig {
  path: string
  component: React.ComponentType<any>
  exact?: boolean
  protected?: boolean
  direct?: boolean
  children?: RouteConfig[]
  roles?: string[]
}

const Login = lazy(() => import("../pages/auth/Login.page.tsx"))
const Register = lazy(() => import("../pages/auth/Register.page.tsx"))
const ChangePassword = lazy(() => import("../pages/auth/ChangePassword.page.tsx"))
const RegistrationSuccess = lazy(() => import("../pages/auth/RegistrationSuccess.page.tsx"))
const CategoriesList = lazy(() => import("../pages/admin/category/categories-list.tsx"))
const EventList = lazy(() => import("../pages/admin/event/event-list.tsx"))
const Profile = lazy(() => import("../pages/profile/profile.page.tsx"))
const UserList = lazy(() => import("../pages/admin/user/user-list.page.tsx"))

const Home = lazy(() => import("../pages/client/Home.page.tsx"))
const Events = lazy(() => import("../pages/client/Events.page.tsx"))
const EventDetails = lazy(() => import("../pages/client/Event-details.page.tsx"))

const NotFound = lazy(() => import("../pages/error/NotFound.page.tsx"))
const Unauthorized = lazy(() => import("../pages/error/Unauthorized.page.tsx"))

export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        component: Home,
      },
      {
        path: "/events",
        component: Events,
      },
      {
        path: "/events/:id",
        component: EventDetails,
      },
      {
        path: "/home",
        component: Home,
      },
    ],
  },
  {
    path: "/login",
    component: Login,
    direct: true,
  },
  {
    path: "/register",
    component: Register,
    direct: true,
  },
  {
    path: "/registeration-success",
    component: RegistrationSuccess,
    direct: true
  },
  {
    path: "/unauthorized",
    component: Unauthorized,
  },
  {
    path: "/not-found",
    component: NotFound,
  },
]

export const protectedRoutes: RouteConfig[] = [
  {
    path: "/profile",
    component: Profile,
    protected: true,
  },
  {
    path: "/change-password",
    component: ChangePassword,
    protected: true,
  },
]

export const adminRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    component: AdminLayout,
    protected: true,
    roles: ["ROLE_ADMIN", "ROLE_ORGANIZER"],
    children: [
      {
        path: "/dashboard",
        component: CategoriesList,
      },
      {
        path: "/dashboard/categories",
        component: CategoriesList,
      },
      {
        path: "/dashboard/events",
        component: EventList,
      },
      {
        path: "/dashboard/users",
        component: UserList,
        roles: ["ROLE_ADMIN"],
      },
    ],
  },
]

export const allRoutes: RouteConfig[] = [...publicRoutes, ...protectedRoutes, ...adminRoutes]


