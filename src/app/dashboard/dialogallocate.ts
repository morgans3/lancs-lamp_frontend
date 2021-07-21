import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-allocate",
  templateUrl: "dialogallocate.html",
})
export class AllocateDialogComponent {
  constructor(public dialogRef: MatDialogRef<AllocateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
