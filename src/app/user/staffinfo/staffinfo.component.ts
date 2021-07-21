import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Store } from "@ngxs/store";
import { LAMPService } from "src/app/_services/lamp.service";
import { AuthService } from "../../_services/auth.service";
import { NotificationService } from "../../_services/notification.service";
import { AuthState } from "../../_states/auth.state";
import { FindmynhsnumberComponent } from "../accessform/findmynhsnumber/findmynhsnumber.component";

@Component({
  selector: "app-staffinfo",
  templateUrl: "./staffinfo.component.html",
  styleUrls: ["./staffinfo.component.scss"],
})
export class StaffinfoComponent implements OnInit {
  occupations: any;
  my_health_info_code: any;
  myForm = new FormGroup({
    consentSharing: new FormControl(null),
    consentC: new FormControl(null),
    consentB: new FormControl(null, Validators.required),
    consentA: new FormControl(null, Validators.required),
    occupation: new FormControl(null, Validators.required),
    email: new FormControl(null),
    phone: new FormControl(null),
    nhsnumber: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  tokenDecoded: any;
  staffconsent: any;
  date_of_birth: any;
  globalconsentoverride = false;

  constructor(public dialog: MatDialog, public store: Store, private notificationService: NotificationService, private lampService: LAMPService, private authService: AuthService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.getHealthInfoCodeFromToken();
    }
  }

  ngOnInit() {
    this.populateOccupations();
  }

  populateOccupations() {
    this.lampService.getOccupations().subscribe((data: any) => {
      this.occupations = data.filter((x: any) => x.occupation !== "Other");
    });
  }

  getHealthInfoCodeFromToken() {
    if (this.tokenDecoded) {
      if (this.tokenDecoded.roles && this.tokenDecoded.roles.length > 0) {
        const keys = this.tokenDecoded.roles.flatMap((x: any) => Object.keys(x));
        if (keys.includes("healthinfo_code")) {
          const vals = this.tokenDecoded.roles.flatMap((x: any) => Object.values(x));
          this.my_health_info_code = vals[keys.findIndex((x: any) => x === "healthinfo_code")];
          this.loadMyHealthInfo();
        }
      }
    }
  }

  checkNHSNumber() {
    const dialogRef = this.dialog.open(FindmynhsnumberComponent, {
      width: "90%",
      data: this.tokenDecoded,
    });
    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this.myForm.controls["nhsnumber"].patchValue(response.nhsnumber);
        this.date_of_birth = response.date_of_birth;
      }
    });
  }

  loadMyHealthInfo() {
    this.lampService.loadHealthInfo().subscribe((data: any) => {
      if (data.success && data.success === true) {
        const vals = data.result[0];
        vals.consentA = vals.consenta;
        vals.consentB = vals.consentb;
        vals.consentC = vals.consentc;
        this.myForm.patchValue(vals);
        if (vals.date_of_birth) this.date_of_birth = vals.date_of_birth;
        this.loadConsentToShare();
      } else {
        this.notificationService.warning("Unable to find details. Reason: " + data.msg);
      }
    });
  }

  onSubmit() {
    if (this.checkContact()) {
      if (this.globalconsentoverride) {
        this.saveConsenttoShare();
      }
      const health_info: any = {
        username: this.tokenDecoded.username,
        organisation: this.tokenDecoded.organisation,
        nhsnumber: this.myForm.controls.nhsnumber.value,
        date_of_birth: this.date_of_birth,
        occupation: this.myForm.controls.occupation.value,
        consentA: this.myForm.controls.consentA.value,
        consentB: this.myForm.controls.consentB.value,
        consentC: this.myForm.controls.consentC.value || false,
      };
      if (this.myForm.controls.email.value && this.myForm.controls.email.value.length > 0) {
        health_info["email"] = this.myForm.controls.email.value;
      }
      if (this.myForm.controls.phone.value && this.myForm.controls.phone.value.length > 0) {
        health_info["phone"] = this.myForm.controls.phone.value;
      }
      if (this.my_health_info_code) {
        health_info["my_health_info_code"] = this.my_health_info_code;
      }
      this.lampService.updateHealthInfo(health_info).subscribe((data: any) => {
        if (data.success && data.success === true) {
          if (data.healthcode) {
            this.my_health_info_code = data.healthcode;
            this.addHealthInfoRole(data.healthcode);
          }
        } else {
          this.notificationService.warning("Unable to register details. Reason: " + data.msg);
        }
      });
    }
  }

  saveConsenttoShare() {
    if (this.staffconsent) {
      this.lampService.updateStaffConsent({ nhsnumber: this.myForm.controls.nhsnumber.value, consentsharing: this.myForm.controls.consentSharing.value || this.globalconsentoverride }).subscribe((data: any) => {
        if (data.success && data.success === false) {
          this.notificationService.warning("Unable to update Staff consent information. Please contact support.");
        }
      });
    } else {
      this.lampService.registerStaffConsent({ nhsnumber: this.myForm.controls.nhsnumber.value, consentsharing: this.myForm.controls.consentSharing.value || this.globalconsentoverride }).subscribe((data: any) => {
        if (data.success && data.success === true) {
          this.staffconsent = data.registered;
        } else {
          this.notificationService.warning("Unable to register Staff consent information. Please contact support.");
        }
      });
    }
  }

  loadConsentToShare() {
    if (this.myForm.controls.nhsnumber.value && this.myForm.controls.nhsnumber.value.length > 0 && !this.globalconsentoverride) {
      this.lampService.getStaffConsentByNHSNumber({ nhsnumber: this.myForm.controls.nhsnumber.value }).subscribe((data: any) => {
        if (data && data.length > 0) {
          this.staffconsent = data[0];
          this.myForm.controls.consentSharing.patchValue(data[0].consentsharing);
        }
      });
    }
  }

  addHealthInfoRole(rolevalue: any) {
    const newobject: any = {};
    newobject["healthinfo_code"] = rolevalue;
    const newRole: any = {
      username: this.tokenDecoded.username,
      organisationid: this.tokenDecoded._id,
      roleassignedDT: new Date(),
      assignedby: "Self-Administered",
      role: newobject,
    };
    this.authService.registerRole(newRole).subscribe((data: any) => {
      if (data.success) {
        this.notificationService.success("Role added. You can now use the HiPRES Mobile Application Self-test function.");
      } else {
        this.notificationService.warning("Unable to add or update roles at this time. Reason: " + data.msg);
      }
    });
  }

  checkContact() {
    const email = this.myForm.controls.email.value;
    const phone = this.myForm.controls.phone.value;
    if ((email && email.length > 0) || (phone && phone.length > 0)) {
      return true;
    } else {
      this.notificationService.warning("Requires either an email address or mobile phone number in order to contact you with the results");
      return false;
    }
  }
}
