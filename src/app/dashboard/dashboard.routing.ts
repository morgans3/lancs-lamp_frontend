import { Routes } from "@angular/router";

import { DashboardComponent } from "./dashboard.component";

export const DashboardRoutes: Routes = [
  {
    path: "pathways",
    component: DashboardComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
  },
];
