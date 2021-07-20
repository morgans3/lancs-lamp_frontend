import { Routes } from "@angular/router";

import { FullComponent } from "./layouts/full/full.component";
import { SigninComponent } from "./layouts/full/signin/signin.component";
import { AuthGuard } from "./_guards/auth.guard";

export const AppRoutes: Routes = [
  {
    path: "login",
    pathMatch: "full",
    component: SigninComponent,
  },
  {
    path: "",
    pathMatch: "full",
    component: SigninComponent,
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        redirectTo: "/dashboard",
        pathMatch: "full",
      },
      {
        path: "",
        loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
    ],
  },
  {
    path: "",
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "",
        loadChildren: () => import("./default/default.module").then((m) => m.DefaultModule),
      },
    ],
  },
];
