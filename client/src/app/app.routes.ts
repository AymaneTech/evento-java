import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "auth",
    children: [
      {
        path: "signup",
        loadComponent: () =>
          import("./features/auth/pages/signup/signup.component").then(
            (m) => m.SignupComponent,
          ),
      },
      {
        path: "login",
        loadComponent: () =>
          import("./features/auth/pages/login/login.component").then(
            (m) => m.LoginComponent,
          ),
      },
    ],
  },
];
