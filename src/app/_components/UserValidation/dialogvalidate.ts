import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { AuthService } from "../../_services/auth.service";
import { NotificationService } from "../../_services/notification.service";
import { ManualSetAuthTokens } from "../../_states/auth.state";

@Component({
  selector: "dialog-validate",
  templateUrl: "dialogvalidate.html",
})
export class ValidateDialogComponent {
  errorMessage: any;
  myForm = new FormGroup({
    authcode: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<ValidateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private notificationService: NotificationService, private store: Store) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirm() {
    this.errorMessage = null;
    this.authService.validateMFA(this.myForm.controls["authcode"].value).subscribe((data: any) => {
      if (data.status === 200) {
        this.notificationService.success("Validated successfully.");
        this.store
          .dispatch(
            new ManualSetAuthTokens({
              success: true,
              token: data.token,
            })
          )
          .subscribe((res: any) => {
            this.dialogRef.close(data.token);
          });
      } else {
        this.notificationService.warning("Code note valid.");
        this.errorMessage = data.message;
      }
    });
  }

  removeMFA() {
    this.authService.unregisterMFA().subscribe((data: any) => {
      if (data && data.status && data.status !== 401) {
        this.dialogRef.close();
        this.notificationService.info("MFA method removed.");
      } else {
        this.notificationService.warning("Unable to remove MFA method. Please contact support.");
      }
    });
  }
}
