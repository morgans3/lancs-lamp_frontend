import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgModule } from "@angular/core";
import { UserSearchComponent } from "./user-search/user-search.component";
import { UserSearchDialogComponent } from "./user-search/dialogusersearch";
import { DemoMaterialModule } from "../demo-material-module";
import { UserValidationComponent } from "./UserValidation/UserValidation.component";
import { VerifiyDialogComponent } from "./UserValidation/dialogverifiy";
import { ValidateDialogComponent } from "./UserValidation/dialogvalidate";
import { StatCardComponent } from "./stat-card.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DemoMaterialModule, FlexLayoutModule],
  declarations: [UserSearchComponent, UserSearchDialogComponent, UserValidationComponent, VerifiyDialogComponent, ValidateDialogComponent, StatCardComponent],
  entryComponents: [UserSearchDialogComponent, UserSearchComponent, UserValidationComponent, VerifiyDialogComponent, ValidateDialogComponent, StatCardComponent],
  exports: [UserSearchDialogComponent, UserSearchComponent, UserValidationComponent, VerifiyDialogComponent, ValidateDialogComponent, StatCardComponent],
})
export class ComponentsModule {}
