import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { AuthService } from "../../_services/auth.service";
import { ManualSetAuthTokens } from "../../_states/auth.state";
import { NotificationService } from "../../_services/notification.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "dialog-verifiy",
  templateUrl: "dialogverifiy.html",
})
export class VerifiyDialogComponent {
  alternative = false;
  errorMessage: any;
  tfa: any;
  myForm = new FormGroup({
    authcode: new FormControl(null, Validators.required),
  });

  constructor(private notificationService: NotificationService, public dialogRef: MatDialogRef<VerifiyDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private store: Store) {
    this.tfa = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enableTFA() {
    if (this.myForm.controls["authcode"].value) {
      if (this.alternative) {
        this.authService.otpValidate(this.myForm.controls["authcode"].value.toString()).subscribe((data: any) => {
          if (data && data.status === 200) {
            this.store
              .dispatch(
                new ManualSetAuthTokens({
                  success: true,
                  token: data.token,
                })
              )
              .subscribe((res) => {
                this.dialogRef.close(data.token);
              });
          } else {
            this.errorMessage = "Incorrect code - Unable to verify using this code";
          }
        });
      } else {
        this.authService.verifyMFA(this.myForm.controls["authcode"].value, this.tfa.tempSecret).subscribe((data: any) => {
          if (data && data.status === 200) {
            this.store
              .dispatch(
                new ManualSetAuthTokens({
                  success: true,
                  token: data.token,
                })
              )
              .subscribe((res) => {
                this.dialogRef.close(data.token);
              });
          } else {
            this.errorMessage = "Incorrect code - Unable to verify using this code";
          }
        });
      }
    }
  }

  alternativeFA() {
    this.alternative = true;
    this.authService.generateOTPCode().subscribe((res: any) => {
      if (res && res.success) {
        this.notificationService.info(res.msg);
      } else {
        this.notificationService.warning("Unable to send email, please contact support");
      }
    });
  }
}
