import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { UserSearchComponent } from "./user-search/user-search.component";
import { UserSearchDialogComponent } from "./user-search/dialogusersearch";
import { DemoMaterialModule } from "../demo-material-module";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule],
  declarations: [UserSearchComponent, UserSearchDialogComponent],
  entryComponents: [UserSearchDialogComponent, UserSearchComponent],
  exports: [UserSearchDialogComponent, UserSearchComponent],
})
export class ComponentsModule {}
