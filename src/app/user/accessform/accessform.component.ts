import { Component, ViewChild, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Store } from "@ngxs/store";
import { AuthService } from "src/app/_services/auth.service";
import { LAMPService } from "src/app/_services/lamp.service";
import { NotificationService } from "src/app/_services/notification.service";
import { AuthState } from "src/app/_states/auth.state";
import { FindmynhsnumberComponent } from "./findmynhsnumber/findmynhsnumber.component";

@Component({
  selector: "app-accessform",
  templateUrl: "./accessform.component.html",
  styleUrls: ["./accessform.component.css"],
})
export class AccessformComponent implements OnInit {
  @ViewChild(FormGroupDirective, { static: false })
  trainingcomplete = false;
  selectedrole: any;
  myForm = new FormGroup({
    terms: new FormControl(null, Validators.required),
    role: new FormControl(null, Validators.required),
    nhsnumber: new FormControl(null),
  });
  formDirective: any;
  username: any;
  tokenDecoded: any;
  date_of_birth: any;

  constructor(private lampService: LAMPService, private notificationService: NotificationService, private authService: AuthService, public store: Store, public dialog: MatDialog) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.username = this.tokenDecoded.username;
    }
  }

  ngOnInit() {
    this.lampService.isTrainingComplete(this.username, this.tokenDecoded.organisation).subscribe((_data: any) => {
      if (_data.answer && _data.answer === true) {
        this.trainingcomplete = true;
      }
    });
  }

  checkNHSNumber() {
    const dialogRef = this.dialog.open(FindmynhsnumberComponent, {
      width: "90%",
      data: this.tokenDecoded,
    });
    dialogRef.afterClosed().subscribe((response: any) => {
      if (response) {
        this.myForm.controls["nhsnumber"].patchValue(response.nhsnumber);
        this.date_of_birth = response.date_of_birth;
      }
    });
  }

  changedRole(role: any) {
    this.selectedrole = role;
  }

  onSubmit() {
    if (this.selectedrole === "self" && !this.myForm.controls["nhsnumber"].value) {
      this.notificationService.warning("Invalid NHS number entered");
    } else {
      let rolename = "nhs_number";
      let rolevalue = "%";
      switch (this.selectedrole) {
        case "all":
          rolename = "nhs_number";
          rolevalue = "%";
          break;
        default:
          rolename = "nhs_number";
          rolevalue = this.myForm.controls["nhsnumber"].value;
          break;
      }
      const trainingRecord = {
        username: this.username,
        name: this.tokenDecoded.name,
        agreedterms: "1",
        roleselected: this.selectedrole,
        email: this.tokenDecoded.email,
        organisation: this.tokenDecoded.organisation,
      };
      this.lampService.completeTraining(trainingRecord).subscribe((data: any) => {
        if (data.success === false) {
          this.notificationService.warning("Unable to complete training at this time. Please contact support if this problem persists.");
        } else if (data.success === true) {
          this.notificationService.success("Completed Training.");
          this.trainingcomplete = true;
          this.addHiPRESRole(rolename, rolevalue);
        }
      });
    }
  }

  addHiPRESRole(roletype: any, rolevalue: any) {
    const newobject: any = {};
    newobject["population_" + roletype] = rolevalue;
    const newRole: any = {
      username: this.username,
      organisationid: this.tokenDecoded._id,
      roleassignedDT: new Date(),
      assignedby: "TrainingSystem",
      role: newobject,
    };
    this.authService.registerRole(newRole).subscribe((data: any) => {
      if (data.success) {
        this.notificationService.success("Role added. You can now use the Application for submitting Tests.");
        this.formDirective.resetForm();
        this.trainingcomplete = true;
      } else {
        this.notificationService.warning("Unable to add or update roles at this time. Reason: " + data.msg);
      }
    });
  }
}
