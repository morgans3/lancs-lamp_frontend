import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { CommonModule } from "@angular/common";
import { DefaultRoutes } from "./default.routing";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MainPipe } from "../_pipes/main-pipe.module";
import { AdminComponent } from "./Admin/Admin.component";
import { ComponentsModule } from "../_components/components.module";
import { TestCentresComponent } from "./test-centres/test-centres.component";
import { PathLabsComponent } from "./path-labs/path-labs.component";
import { PathLabFormComponent } from "./path-labs/path-lab-form/path-lab-form.component";
import { TestCentreFormComponent } from "./test-centres/test-centre-form/test-centre-form.component";
import { FindlocationComponent } from "./test-centres/findlocation/findlocation.component";
import { MapComponent } from "./test-centres/findlocation/Map/Map.component";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletDrawModule } from "@asymmetrik/ngx-leaflet-draw";
import { OccupationsComponent } from "./Admin/Occupations/Occupations.component";
import { TestConfigComponent } from "./test-config/test-config.component";
import { ViewPathwayComponent } from "./test-config/view-pathway/view-pathway.component";
import { AdminTrainingresourcesComponent } from "./Admin/admin-trainingresources/admin-trainingresources.component";
import { ResultsComponent } from "./results/results.component";
import { DemoMaterialModule } from "../demo-material-module";
@NgModule({
  imports: [CommonModule, RouterModule.forChild(DefaultRoutes), ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule, MainPipe, ComponentsModule, LeafletModule, LeafletDrawModule],
  declarations: [AdminComponent, TestCentresComponent, PathLabsComponent, PathLabFormComponent, TestCentreFormComponent, FindlocationComponent, MapComponent, OccupationsComponent, TestConfigComponent, ViewPathwayComponent, AdminTrainingresourcesComponent, ResultsComponent],
  entryComponents: [ViewPathwayComponent],
})
export class DefaultModule {}
