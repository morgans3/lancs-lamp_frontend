import { Routes } from "@angular/router";
import { MyresultsComponent } from "./myresults/myresults.component";
import { PathwaysComponent } from "./pathways/pathways.component";
import { UserComponent } from "./user.component";

export const UserRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "pathways",
        component: PathwaysComponent,
      },
      {
        path: "registration",
        component: UserComponent,
      },
      {
        path: "my_results",
        component: MyresultsComponent,
      },
    ],
  },
];
