import { Component, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from "src/app/_services/notification.service";
import { PatientService } from "src/app/_services/patient.service";

@Component({
  selector: "app-findmynhsnumber",
  templateUrl: "./findmynhsnumber.component.html",
})
export class FindmynhsnumberComponent {
  errorMessage: string = "";
  nhsnumber: string = "";
  myForm = new FormGroup({
    postcode: new FormControl(null, Validators.required),
    day: new FormControl(null, Validators.required),
    month: new FormControl(null, Validators.required),
    year: new FormControl(null, Validators.required),
    gender: new FormControl(null, Validators.required),
    forename: new FormControl(null, Validators.required),
    familyname: new FormControl(null, Validators.required),
  });
  date_of_birth: string = "";
  @ViewChild(FormGroupDirective, { static: false }) formDirective: any;

  constructor(private notificationService: NotificationService, public dialogRef: MatDialogRef<FindmynhsnumberComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private patientService: PatientService) {}

  confirm() {
    this.errorMessage = "";
    if (this.nhsnumber) {
      this.dialogRef.close({ nhsnumber: this.nhsnumber, date_of_birth: this.date_of_birth });
    } else {
      this.errorMessage = "Unable to find NHS Number in Patient Registry.";
      this.notificationService.warning("Unable to find NHS Number in Patient Registry.");
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  findMyNHSNumber() {
    this.date_of_birth = this.myForm.value.year.toString() + "-" + this.myForm.value.month.toString() + "-" + this.myForm.value.day.toString();
    const payload = {
      dob: this.date_of_birth,
      gender: this.myForm.value.gender,
      postcode: this.myForm.value.postcode.toString().toUpperCase(),
      forename: this.myForm.value.forename,
      familyname: this.myForm.value.familyname,
    };
    this.patientService.findMyNHSNumberfromSpine(payload).subscribe((data: any) => {
      if (data.success && data.success === true) {
        if (data.nhsnumber) {
          this.nhsnumber = data.nhsnumber;
        } else {
          this.notificationService.info("Unable to find an NHS Number for these details, please check that the information matches the patterns provided.");
        }
      } else {
        this.notificationService.warning("Unable to search for NHS Numbers at this time. Please contact support if this problem persists.");
      }
    });
  }
}
