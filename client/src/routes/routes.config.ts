import { lazy } from 'react';

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
  roles?: string[];
}

const Home = lazy(() => import('../Home'));

export const publicRoutes: RouteConfig[] = [
  {
    path: "home",
    component: Home,
    exact: true
  }
  // {
  //     path: '/not-found',
  //     component: NotFoundPage,
  //     exact: true,
  // }
];

export const protectedRoutes: RouteConfig[] = [
];

export const adminRoutes: RouteConfig[] = [
];

export const allRoutes: RouteConfig[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
];
