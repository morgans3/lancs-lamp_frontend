import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserComponent } from "./user.component";
import { MyresultsComponent } from "./myresults/myresults.component";
import { PathwaysComponent } from "./pathways/pathways.component";
import { UserRoutes } from "./user.routing";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DemoMaterialModule } from "../demo-material-module";
import { ComponentsModule } from "../_components/components.module";
import { MainPipe } from "../_pipes/main-pipe.module";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(UserRoutes), ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule, MainPipe, ComponentsModule],
  declarations: [UserComponent, MyresultsComponent, PathwaysComponent],
})
export class UserModule {}
