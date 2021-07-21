import { Routes } from "@angular/router";
import { AdminComponent } from "./Admin/Admin.component";
import { PathLabsComponent } from "./path-labs/path-labs.component";
import { TestCentresComponent } from "./test-centres/test-centres.component";
import { TestConfigComponent } from "./test-config/test-config.component";
import { RoleGuard } from "../_guards/role.guard";
import { ResultsComponent } from "./results/results.component";
import { SupportComponent } from "./support/support.component";

export const DefaultRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "testcentres",
        component: TestCentresComponent,
        canActivate: [RoleGuard],
        data: { roles: ["Administrator"] },
      },
      {
        path: "pathlabs",
        component: PathLabsComponent,
        canActivate: [RoleGuard],
        data: { roles: ["Administrator"] },
      },
      {
        path: "testconfiguration",
        component: TestConfigComponent,
        canActivate: [RoleGuard],
        data: { roles: ["Administrator"] },
      },
      {
        path: "admin",
        component: AdminComponent,
        canActivate: [RoleGuard],
        data: { roles: ["Administrator"] },
      },
      {
        path: "results",
        component: ResultsComponent,
        canActivate: [RoleGuard],
        data: { roles: ["Administrator"] },
      },
      {
        path: "problems",
        component: SupportComponent,
      },
    ],
  },
];
