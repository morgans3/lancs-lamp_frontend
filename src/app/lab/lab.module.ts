import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LabComponent } from "./lab.component";
import { LabRoutes } from "./lab.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DemoMaterialModule } from "../demo-material-module";
import { ComponentsModule } from "../_components/components.module";
import { MainPipe } from "../_pipes/main-pipe.module";
import { ReceiptingComponent } from "./receipting/receipting.component";
import { ResultingComponent } from "./resulting/resulting.component";

@NgModule({
  imports: [CommonModule, RouterModule.forChild(LabRoutes), ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule, MainPipe, ComponentsModule],
  declarations: [LabComponent, ReceiptingComponent, ResultingComponent],
})
export class LabModule {}
