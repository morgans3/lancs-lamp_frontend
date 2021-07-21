import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Store } from "@ngxs/store";
import { orgstructures } from "src/app/_models/lamp";
import { LAMPService } from "src/app/_services/lamp.service";
import { NotificationService } from "src/app/_services/notification.service";
import { PatientService } from "src/app/_services/patient.service";
import { AuthState } from "src/app/_states/auth.state";
import { ConfirmDialogComponent } from "./dialogconfirm";
import { EditOrgStructDialogComponent } from "./dialogeditorgstruct";

@Component({
  selector: "app-orgstructuretool",
  templateUrl: "./orgstructuretool.component.html",
  styleUrls: ["./orgstructuretool.component.scss"],
})
export class OrgstructuretoolComponent implements OnInit, AfterViewInit {
  selectedWorkforce: any;
  tokenDecoded: any;
  organisations = [];
  orglayout: orgstructures[] = [];
  currentFocus: any;
  parentFocus: any;
  parentlevel: orgstructures[] = [];
  currentlevel: orgstructures[] = [];
  childlevel: orgstructures[] = [];
  dataLoaded = false;

  constructor(public dialog: MatDialog, private router: Router, private notificationService: NotificationService, public store: Store, private lampService: LAMPService, private patientService: PatientService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
    }
    this.populateOrgs();
  }

  ngOnInit() {
    this.loadWorkforce();
  }

  ngAfterViewInit() {
    this.loadWorkforce();
  }

  returntodashboard() {
    this.router.navigate(["/stafftesting"]);
  }

  populateOrgs() {
    this.lampService.getOccupations().subscribe((data: any) => {
      this.organisations = data.filter((x: any) => x.occupation.includes("Staff"));
    });
  }

  loadWorkforce() {
    if (localStorage.getItem("orgstructure")) {
      this.selectedWorkforce = localStorage.getItem("orgstructure");
      // localStorage.removeItem("orgstructure");
      this.parentFocus = {
        id: null,
        organisation: this.selectedWorkforce,
        createdDT: null,
        updatedDT: null,
        parent: null,
        area: this.selectedWorkforce,
      };
      this.populateWorkForceAreas();
    }
  }

  populateWorkForceAreas() {
    this.lampService.getOrgStructuresByOrg({ org: this.selectedWorkforce }).subscribe((res: any) => {
      this.dataLoaded = true;
      this.orglayout = res;
      this.setFocus(this.parentFocus);
    });
  }

  backtotop() {
    this.setFocus(this.parentFocus);
  }

  setFocus(area: orgstructures) {
    this.currentFocus = area;
    this.parentlevel = this.setParentLevel();
    this.currentlevel = this.setCurrentLevel();
    this.childlevel = this.setChildLevel();
  }

  setCurrentLevel() {
    let level: any = [];
    if (this.currentFocus.area === this.selectedWorkforce) {
      level.push(this.parentFocus);
      return level;
    }
    if (this.currentFocus.parent) {
      level = this.orglayout.filter((x) => x.parent === this.currentFocus.parent);
      if (level.length > 0)
        level.sort((a: any, b: any) => {
          var textA = a.area.toUpperCase();
          var textB = b.area.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      return level;
    }
    return level;
  }

  setChildLevel() {
    let level = [];
    if (this.currentFocus.area === this.selectedWorkforce) {
      level = this.orglayout.filter((x) => x.parent === this.selectedWorkforce);
      if (level.length > 0)
        level.sort((a, b) => {
          var textA = a.area.toUpperCase();
          var textB = b.area.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      return level;
    } else {
      level = this.orglayout.filter((x) => x.parent === this.currentFocus.id.toString());
      if (level.length > 0)
        level.sort((a, b) => {
          var textA = a.area.toUpperCase();
          var textB = b.area.toUpperCase();
          return textA < textB ? -1 : textA > textB ? 1 : 0;
        });
      return level;
    }
  }

  setParentLevel() {
    let parentlevel: any = [];
    if (this.currentFocus.area === this.selectedWorkforce) {
      return parentlevel;
    } else {
      if (this.currentFocus.parent) {
        if (this.currentFocus.parent === this.selectedWorkforce) {
          return [this.parentFocus];
        } else {
          const parent = this.orglayout.find((x) => x.id.toString() === this.currentFocus.parent);
          if (parent) {
            parentlevel = this.orglayout.filter((x) => x.parent === parent.parent);
            if (parentlevel.length > 0)
              parentlevel.sort((a: any, b: any) => {
                var textA = a.area.toUpperCase();
                var textB = b.area.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
              });
          }
          return parentlevel;
        }
      } else {
        return parentlevel;
      }
    }
  }

  editArea(area: orgstructures) {
    const dialogRef = this.dialog.open(EditOrgStructDialogComponent, {
      width: "90%",
      data: area,
    });
    dialogRef.afterClosed().subscribe((result: orgstructures) => {
      if (result) {
        this.lampService.updateOrgStructures(result).subscribe((res: any) => {
          if (res.success) {
            this.notificationService.success("Area Updated");
            this.currentlevel.splice(this.currentlevel.indexOf(area), 1, result);
            this.orglayout.splice(this.orglayout.indexOf(area), 1, result);
            this.currentFocus = result;
          } else {
            this.notificationService.warning("Unable to update this area.");
          }
        });
      }
    });
  }

  addArea() {
    const dialogRef = this.dialog.open(EditOrgStructDialogComponent, {
      width: "90%",
      data: { organisation: this.selectedWorkforce, parent: this.currentFocus.id || this.selectedWorkforce },
    });
    dialogRef.afterClosed().subscribe((result: orgstructures) => {
      if (result) {
        this.lampService.addOrgStructures(result).subscribe((res: any) => {
          if (res.success) {
            this.notificationService.success("Area Added");
            this.childlevel.push(res.item);
            this.orglayout.push(res.item);
          } else {
            this.notificationService.warning("Unable to add this area.");
          }
        });
      }
    });
  }

  removeArea(area: orgstructures) {
    if (this.hasChildren(area)) {
      this.notificationService.warning("Unable to remove this area as it has Sub-areas linked to it.");
      return;
    }
    this.lampService.getStaffAreasByArea({ areaid: area.id.toString() }).subscribe((res: any) => {
      if (res.length > 0) {
        this.notificationService.warning("Unable to remove this area as it has " + res.length + " staff allocated to it.");
        return;
      } else {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: "90%",
          data: area,
        });
        dialogRef.afterClosed().subscribe((result: boolean) => {
          if (result) {
            this.lampService.removeOrgStructures(area).subscribe((res: any) => {
              if (res.success) {
                this.notificationService.success("Area Removed");
                this.childlevel.splice(this.childlevel.indexOf(area), 1);
                this.orglayout.splice(this.orglayout.indexOf(area), 1);
              } else {
                this.notificationService.warning("Unable to remove this area.");
              }
            });
          }
        });
      }
    });
  }

  hasChildren(area: orgstructures) {
    if (this.orglayout.filter((x) => x.parent === area.id.toString()).length > 0) return true;
    return false;
  }
}
