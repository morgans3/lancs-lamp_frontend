import { Component, Inject, ViewChild } from "@angular/core";
import { FormGroupDirective, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { orgstructures } from "src/app/_models/lamp";

@Component({
  selector: "dialog-editorgstruct",
  templateUrl: "dialogeditorgstruct.html",
})
export class EditOrgStructDialogComponent {
  @ViewChild(FormGroupDirective)
  formDirective: any;
  myForm = new FormGroup({
    area: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<EditOrgStructDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data) {
      this.myForm.patchValue(this.data);
    }
  }

  onSubmit() {
    const area: orgstructures = {
      id: this.data.id || null,
      organisation: this.data.organisation,
      createdDT: this.data.createdDT || null,
      updatedDT: this.data.updatedDT || null,
      parent: this.data.parent,
      area: this.myForm.controls.area.value,
    };
    this.dialogRef.close(area);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
