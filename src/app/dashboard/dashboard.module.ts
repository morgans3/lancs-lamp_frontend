import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DemoMaterialModule } from "../demo-material-module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutes } from "./dashboard.routing";
import { ChartistModule } from "ng-chartist";
import { OrgstructuretoolComponent } from "./orgstructuretool/orgstructuretool.component";
import { EditOrgStructDialogComponent } from "./orgstructuretool/dialogeditorgstruct";
import { ConfirmDialogComponent } from "./orgstructuretool/dialogconfirm";
import { UserModule } from "../user/user.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "../_components/components.module";

@NgModule({
  imports: [CommonModule, DemoMaterialModule, FlexLayoutModule, ChartistModule, RouterModule.forChild(DashboardRoutes), UserModule, ReactiveFormsModule, FormsModule, ComponentsModule],
  declarations: [DashboardComponent, OrgstructuretoolComponent, EditOrgStructDialogComponent, ConfirmDialogComponent],
  entryComponents: [EditOrgStructDialogComponent, ConfirmDialogComponent],
})
export class DashboardModule {}
