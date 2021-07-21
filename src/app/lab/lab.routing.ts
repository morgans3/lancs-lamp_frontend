import { Routes } from "@angular/router";
import { RoleGuard } from "../_guards/role.guard";
import { ReceiptingComponent } from "./receipting/receipting.component";
import { ResultingComponent } from "./resulting/resulting.component";

export const LabRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "resulting",
        component: ResultingComponent,
        canActivate: [RoleGuard],
        data: { roles: ["LabStaff"] },
      },
      {
        path: "receipting",
        component: ReceiptingComponent,
        canActivate: [RoleGuard],
        data: { roles: ["LabStaff"] },
      },
    ],
  },
];
