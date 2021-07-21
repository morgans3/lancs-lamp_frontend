import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Store } from "@ngxs/store";
import { StatCardData } from "../_components/stat-card.component";
import { orgacknowledgements, orgstructures, staffarea } from "../_models/lamp";
import { LAMPService } from "../_services/lamp.service";
import { NotificationService } from "../_services/notification.service";
import { PatientService } from "../_services/patient.service";
import { AuthState } from "../_states/auth.state";
import { AllocateDialogComponent } from "./dialogallocate";
import { UserDialogComponent } from "./dialogprofile";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { Pdscache } from "../_models/patient";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  allSelected = false;
  totalStats: StatCardData = {
    title: "Staff in List / # Registered",
    value: "0",
    icon: "fas fa-notes-medical",
    color: "bg-info",
  };
  monitorStats: StatCardData = {
    title: "Compliance (Test in last 7 days)",
    value: "0",
    icon: "fas fa-calendar-star",
    color: "bg-megna",
  };
  reviewStats: StatCardData = {
    title: "Awaiting Result from Lab",
    value: "0",
    icon: "fas fa-vials",
    color: "bg-primary",
  };
  dischargeStats: StatCardData = {
    title: "Current Positives",
    value: "0",
    icon: "fas fa-shield-virus",
    color: "bg-danger",
  };
  dataFetched = true;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  options = [{ value: "null", name: "No data available" }];
  organisations = [];
  displayedColumns: string[] = ["nhs_number", "name", "contact", "functions", "current", "compliance", "results"];
  allpatients: any[] = [];
  alltests: any[] = [];
  patients: any[] = [];
  limit = "25000";
  sensitiveData = false;
  tokenDecoded: any;
  group: FormGroup = new FormGroup({
    organisation_ddl: new FormControl(null),
  });
  hasRole = false;
  workforces: any = [];
  selectedWorkforce: any;
  noncompliant = false;
  nonregistered = false;
  lastrejected = false;
  positivesonly = false;
  acks: orgacknowledgements[] = [];
  selectedLevel: any;
  staffareas: staffarea[] = [];
  areas: orgstructures[] = [];
  globalconsentoverride = false;
  pdscache: Pdscache[] = [];
  updatecachestore: Pdscache[] = [];
  pdssearchcount = 0;

  constructor(private router: Router, public dialog: MatDialog, private patientService: PatientService, private notificationService: NotificationService, public store: Store, private lampService: LAMPService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.populateWorkforces();
    }
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.populateOrgs();
  }

  populateWorkforces() {
    if (this.tokenDecoded && this.tokenDecoded.roles) {
      const workforces = this.tokenDecoded.roles.filter((x: any) => x["cvi_workforce"] && x["cvi_workforce"] !== "deny");
      if (workforces.length > 0) {
        workforces.forEach((force: any) => {
          this.workforces.push(force["cvi_workforce"]);
        });
      }
    }
  }

  checkOrgRoleExists(selectedForce: any) {
    if (this.workforces.includes(selectedForce)) {
      return true;
    } else {
      return false;
    }
  }

  getOrgs() {
    this.lampService.getOrgStructuresByOrg({ org: this.selectedWorkforce }).subscribe((res: any) => {
      this.areas = res;
    });
  }

  getacks(org: string) {
    this.lampService.getOrgAcknowledgementsByOrg({ org: org }).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.acks = res;
        this.acks.forEach((ack) => {
          const patient = this.allpatients.find((x) => x.nhs_number === ack.nhsnumber);
          if (patient) {
            const result = patient.results.filter((x: any) => x.barcode_value === ack.barcode_value);
            if (result && result.length > 0) {
              result[0].ack = { barcode_value: ack.barcode_value, organisation: ack.organisation, username: ack.username, displayname: ack.displayname, createdDT: ack.createdDT };
            }
          }
        });
      }
      this.setData();
    });
  }

  orgstructuretool() {
    if (this.selectedWorkforce) {
      if (this.hasRole) {
        if (localStorage.getItem("orgstructure")) {
          localStorage.removeItem("orgstructure");
        }
        localStorage.setItem("orgstructure", this.selectedWorkforce);
        this.router.navigate(["/orgstructuretool"]);
      } else {
        this.notificationService.warning("You do not have permissions to view or edit this organisations information.");
      }
    } else {
      this.notificationService.info("Please select an Organisation before proceeding to use the Structure tool");
    }
  }

  ackResult(result: any) {
    if (result.result === "POSITIVE" && (result.ack === undefined || result.ack === null)) {
      const ack = { barcode_value: result.barcode_value, organisation: this.selectedWorkforce, username: this.tokenDecoded.username, displayname: this.tokenDecoded.name, createdDT: new Date(), nhsnumber: result.nhs_number };
      this.lampService.addOrgAcknowledgements(ack).subscribe((res: any) => {
        if (res.success) {
          result.ack = ack;
          this.notificationService.success("Result acknowledgement recorded");
        }
      });
    }
  }

  populateOrgs() {
    this.lampService.getOccupations().subscribe((data: any) => {
      this.organisations = data.filter((x: any) => x.occupation.includes("Staff"));
    });
  }

  updatePID(event: any) {
    if (event) {
      this.tokenDecoded = event;
      if (this.tokenDecoded.mfa) {
        this.sensitiveData = true;
      } else {
        this.sensitiveData = false;
      }
    } else {
      this.notificationService.warning("Authentication error: no new passport attached.");
    }
  }

  getPatients() {
    this.dataFetched = false;
    this.alltests = [];
    this.allpatients = [];
    this.patients = [];
    this.getOrgs();
    this.patientService.getPDSCache({ organisation: this.selectedWorkforce }).subscribe((res: any) => {
      this.pdscache = res;
      this.lampService.getPathwayDataByOccupation({ occupation: this.selectedWorkforce, limit: this.limit }).subscribe(
        (data: any) => {
          this.alltests = data;
          this.sortTestsIntoPatients();
          this.getacks(this.selectedWorkforce);
        },
        (error) => {
          this.dataFetched = true;
          this.notificationService.warning("Unable to retrieve staff list. You may not have a role to view your organisation's information. Please contact support.");
        }
      );
    });
  }

  showAreas(row: any) {
    const myareas = this.staffareas.filter((x) => x.nhsnumber === row.nhs_number);
    let areatext = "";
    if (myareas.length > 0) {
      myareas.forEach((area: any) => {
        const areainner: any = this.areas.find((x: any) => x.id === area.areaid);
        areatext += " \n  BELONGS TO : " + areainner.area;
      });
      areatext += " \n \n";
    }
    return areatext + "Click to Allocate to Areas";
  }

  filterToArea(area: orgstructures) {
    this.selectedLevel = area;
    this.sortTestsIntoPatients();
    this.setData();
  }

  allocatestafftoarea(row: any) {
    const popupdata = {
      selectedWorkforce: this.selectedWorkforce,
      nhsnumber: row.nhs_number,
    };
    const dialogRef = this.dialog
      .open(AllocateDialogComponent, {
        width: "90%",
        data: popupdata,
      })
      .afterClosed()
      .subscribe((res) => {
        this.getStaffAreas();
        this.setData();
      });
  }

  sortTestsIntoPatients() {
    this.allpatients = [];
    this.pdssearchcount = 0;
    let filteredlist: staffarea[] = [];
    if (this.selectedLevel) {
      filteredlist = this.staffareas.filter((x) => x.areaid === this.selectedLevel.id);
      if (this.areas && this.areas.filter((x) => x.parent === this.selectedLevel.id.toString()).length > 0) {
        filteredlist = this.addDescendants(filteredlist, this.selectedLevel);
      }
    }
    this.alltests.forEach((test) => {
      if (this.passesCheck(test.nhs_number, filteredlist)) {
        const exists = this.allpatients.filter((x) => x.nhs_number === test.nhs_number);
        if (exists.length > 0) {
          exists[0].results.push({ nhs_number: test.nhs_number, pathwayid: test.pathwayid, pathwayname: test.pathwayname, requestedDT: test.requestedDT, result: test.result, notify_citizenDT: test.notify_citizenDT, consent: test.consent, barcode_value: test.barcode_value });
          exists[0].results.sort((a: any, b: any) => new Date(b.requestedDT).getTime() - new Date(a.requestedDT).getTime());
          exists[0].current = exists[0].results[0].result || "Awaiting";
          exists[0].consent = exists[0].results[0].consent || this.globalconsentoverride;
          exists[0].compliance = this.getCompliance(exists[0].results[0].requestedDT);
        } else {
          let phone = null;
          if (test.citizen_preferred_mobile) {
            phone = "(+44) " + test.citizen_preferred_mobile;
          }
          const newpatient = {
            nhs_number: test.nhs_number,
            name: this.getNamefromNHSNumber(test.nhs_number, test.date_of_birth),
            registeredusername: test.registeredusername,
            dob: test.date_of_birth,
            results: [{ nhs_number: test.nhs_number, pathwayid: test.pathwayid, pathwayname: test.pathwayname, requestedDT: test.requestedDT, result: test.result, notify_citizenDT: test.notify_citizenDT, consent: test.consent, barcode_value: test.barcode_value }],
            current: test.result || "Awaiting",
            consent: test.consent || this.globalconsentoverride,
            compliance: this.getCompliance(test.requestedDT),
            contact: phone || test.citizen_preferred_email,
          };
          this.allpatients.push(newpatient);
        }
      }
    });
  }

  addDescendants(original: any, area: any) {
    const children = this.areas.filter((x) => x.parent === area.id.toString());
    if (children.length > 0) {
      children.forEach((child) => {
        const matches = this.staffareas.filter((x) => x.areaid === child.id);
        matches.forEach((match) => original.push(match));
        this.addDescendants(original, child);
      });
    }
    return original;
  }

  passesCheck(nhsnumber: string, filteredlist: staffarea[]) {
    if (this.selectedLevel == null || this.selectedLevel === undefined) {
      return true;
    }
    if (this.selectedLevel && filteredlist.filter((x) => x.nhsnumber === nhsnumber).length > 0) {
      return true;
    }
    return false;
  }

  getCompliance(testdate: any) {
    const compdate = new Date(testdate);
    compdate.setDate(compdate.getDate() + 7);
    const now = new Date();
    if (now.getTime() < compdate.getTime()) {
      return true;
    }
    return false;
  }

  getDetails(row: any) {
    const payload = {
      NHSNumber: row.nhs_number,
      DateOfBirth: row.dob,
    };
    this.patientService.getSpinePatientDemographics(payload).subscribe(
      (res: any) => {
        if (res) {
          if (res["postcode"]) {
            delete res["postcode"];
          }
          const dialogRef = this.dialog.open(UserDialogComponent, {
            width: "350px",
            data: res,
          });
        }
      },
      (error: any) => {
        this.notificationService.info("Unable to locate this person, please contact support.");
      }
    );
  }

  isNew(result: any) {
    let date = new Date();
    date.setDate(date.getDate() - 4);
    if (result.ack) {
      return false;
    }
    if (result.requestedDT && new Date(result.requestedDT) > date) {
      return true;
    } else {
      return false;
    }
  }

  displayTooltip(result: any) {
    let ack = "";
    if (result.ack) {
      ack = " \n \n  RESULT ACKNOWLEDGED BY : " + result.ack.displayname + " \n  ON BEHALF OF : " + result.ack.organisation + " \n  ON : " + result.ack.createdDT;
    }
    return "Pathway : " + result.pathwayname + " \n  Test Taken : " + result.requestedDT + " \n  Result Recorded : " + result.notify_citizenDT + " \n  Result : " + (result.result || "Awaiting Result") + ack;
  }

  getIcon(result: any, status: any) {
    if (status) {
      if (status.toLowerCase() === "rejected") {
        return "fas fa-times-hexagon";
      }
      if (result.pathwayname.includes("LAMP")) {
        if (result.ack) {
          return "fas fa-lamp-floor";
        } else {
          return "fas fa-lamp-desk";
        }
      } else {
        return "fas fa-question-circle";
      }
    } else {
      return "fas fa-vial";
    }
  }

  scanStats() {
    const numRegistered = this.allpatients.filter((x) => x.registeredusername).length.toString();
    this.totalStats.text = this.allpatients.length.toString() + " / " + numRegistered;
    this.reviewStats.text = this.allpatients.filter((x) => x.current === "Awaiting").length.toString();
    this.dischargeStats.text = this.allpatients.filter((x) => x.current === "POSITIVE").length.toString();
    const complianttotal = this.allpatients.filter((x) => x.compliance).length.toString();
    let compliantpercent = "0%";
    if (complianttotal !== "0") {
      compliantpercent = ((parseInt(complianttotal) / parseInt(this.totalStats.text)) * 100).toFixed(2).toString() + "%";
    }
    this.monitorStats.text = complianttotal + " / " + compliantpercent;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  checkFilter(checktype: string) {
    this.setData();
    if (this.positivesonly) {
      this.patients = this.patients.filter((x) => x.current === "POSITIVE");
    }
    if (this.lastrejected) {
      this.patients = this.patients.filter((x) => x.current === "REJECTED");
    }
    if (this.noncompliant) {
      this.patients = this.patients.filter((x) => x.compliance === false);
    }
    if (this.nonregistered) {
      this.patients = this.patients.filter((x) => x.registeredusername === null);
    }
    this.dataSource = new MatTableDataSource(this.patients);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  setData() {
    this.patients = this.allpatients;
    this.dataSource = new MatTableDataSource(this.patients);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataFetched = true;
    this.scanStats();
  }

  filterOccupation(value: any) {
    this.allpatients = [];
    this.alltests = [];
    this.setData();
    this.selectedWorkforce = value;
    if (this.checkOrgRoleExists(value)) {
      this.hasRole = true;
      this.getPatients();
      this.getStaffAreas();
    } else {
      this.hasRole = false;
    }
  }

  getStaffAreas() {
    this.lampService.getStaffAreasByOrg({ org: this.selectedWorkforce }).subscribe((res: any) => {
      this.staffareas = res;
    });
  }

  clearFilters() {
    this.group.reset();
    this.selectedLevel = null;
    this.allpatients = [];
    this.alltests = [];
    this.setData();
  }

  getNamefromNHSNumber(nhsnumber: string, dob: string) {
    let exists = null;
    if (this.pdscache.length > 0) {
      exists = this.pdscache.find((x) => x.nhsnumber === nhsnumber);
    }
    if (exists) {
      return exists.firstname + " " + exists.familyname;
    } else {
      if (dob) {
        const payload = {
          NHSNumber: nhsnumber,
          DateOfBirth: dob,
        };
        this.pdssearchcount++;
        this.patientService.getSpinePatientDemographics(payload).subscribe((res: any) => {
          if (res && res.forename) {
            this.updatecachestore.push({
              nhsnumber: nhsnumber,
              date_of_birth: dob,
              firstname: res.forename,
              familyname: res.surname,
              organisation: this.selectedWorkforce,
            });
            this.insertNewName(nhsnumber, res.forename + " " + res.surname);
            return res.forename + " " + res.surname;
          } else {
            this.insertNewName(nhsnumber, "Unable to find details on NHS Spine");
            return "Unable to find details on NHS Spine";
          }
        });
      } else {
        return "No saved DOB - Unable to lookup on NHS Spine";
      }
    }
  }

  insertNewName(nhsnumber: any, name: any) {
    this.allpatients.find((x) => x.nhs_number === nhsnumber).name = name;
    this.pdssearchcount--;
    if (this.pdssearchcount === 0) {
      this.flushcache();
      this.setData();
    }
  }

  flushcache() {
    if (this.updatecachestore.length > 0) {
      this.patientService.savePDSCache({ organisation: this.selectedWorkforce, patientlist: this.updatecachestore }).subscribe((res: any) => {
        this.updatecachestore = [];
      });
    }
  }

  shortenText(text: string) {
    if (text && text.length > 18) {
      return text.substring(0, 16) + "...";
    } else {
      return text;
    }
  }

  exportRegisteredStaffToCsv(hasMFA: boolean) {
    const today = new Date();
    const csvName = "Workforce Dashboard Export (staff) -" + today.getFullYear() + (today.getMonth() + 1) + today.getDate();
    const options = {
      title: "Nexus Intelligence - " + csvName,
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: false,
      useBom: true,
      // tslint:disable-next-line: max-line-length
      headers: ["username", "name", "email", "organisation", "registeredDT", "roleselected", "hipres_access", "hipres_trainer", "manages_staff"],
    };

    const exportData: any = [];

    if (!hasMFA) {
      this.notificationService.warning("Authentication Error. Please Provide Multi-Factor Authentication Before Exporting Data");
    } else {
      this.lampService.getRegisteredStaff().subscribe(
        (data: any) => {
          const filtereddata = data.filter((x: any) => x.organisation === this.tokenDecoded.organisation);
          filtereddata.forEach((person: any) => {
            exportData.push({
              username: person.username,
              name: person.name,
              email: person.email,
              organisation: person.organisation,
              registeredDT: new Date(person.registeredDT).toISOString(),
              roleselected: person.roleselected,
              hipres_access: person.hipres_access,
              hipres_trainer: person.hipres_trainer,
              manages_staff: person.manages_staff,
            });
          });
          const file = new Angular2Csv(exportData, csvName, options);
          this.notificationService.info(this.tokenDecoded.organisation + "'s Registered Staff Data Exported.");
        },
        (error) => {
          this.dataFetched = true;
          this.notificationService.warning("Unable to retrieve staff list. You may not have a role to view your organisation's information. Please contact support.");
        }
      );
    }
  }

  exportTestDataToCsv(hasMFA: boolean) {
    const today = new Date();
    const csvName = "Workforce Dashboard Export -" + today.getFullYear() + (today.getMonth() + 1) + today.getDate();
    const options = {
      title: "Nexus Intelligence - " + csvName,
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: false,
      useBom: true,
      // tslint:disable-next-line: max-line-length
      headers: ["id", "nhs_number", "name", "barcode_value", "requestedDT", "requested_by", "pathwayid", "xds_document_name", "intended_location", "citizen_preferred_email", "citizen_preferred_mobile", "result", "notify_citizenDT", "occupation", "consentgiven", "consentgivendirectcare", "consentgivenresearch", "s3_filename", "lambdaDT", "date_of_birth", "pathwayname", "consent", "registeredusername"],
    };

    const exportData: any = [];

    if (!hasMFA) {
      this.notificationService.warning("Authentication Error. Please Provide Multi-Factor Authentication Before Exporting Data");
    } else {
      this.lampService.getPathwayDataByOccupation({ occupation: this.selectedWorkforce, limit: "9999999" }).subscribe(
        (data: any) => {
          data.forEach((test: any) => {
            let lambdadt = null;
            if (test.lambdaDT) {
              lambdadt = new Date(test.lambdaDT).toISOString();
            }
            let notify_citizenDT = null;
            if (test.notify_citizenDT) {
              notify_citizenDT = new Date(test.notify_citizenDT).toISOString();
            }
            let name = null;
            const person = this.allpatients.find((x) => x.nhs_number === test.nhs_number);
            if (person) {
              name = person.name;
            }
            exportData.push({
              id: test.id,
              nhs_number: test.nhs_number,
              name: name,
              barcode_value: test.barcode_value,
              requestedDT: new Date(test.requestedDT).toISOString(),
              requested_by: test.requested_by,
              pathwayid: test.pathwayid,
              xds_document_name: test.xds_document_name,
              intended_location: test.intended_location,
              citizen_preferred_email: test.citizen_preferred_email,
              citizen_preferred_mobile: test.citizen_preferred_mobile,
              result: test.result,
              notify_citizenDT: notify_citizenDT,
              occupation: test.occupation,
              consentgiven: test.consentgiven,
              consentgivendirectcare: test.consentgivendirectcare,
              consentgivenresearch: test.consentgivenresearch,
              s3_filename: test.s3_filename,
              lambdaDT: lambdadt,
              date_of_birth: new Date(test.date_of_birth).toISOString(),
              pathwayname: test.pathwayname,
              consent: test.consent,
              registeredusername: test.registeredusername,
            });
          });
          const file = new Angular2Csv(exportData, csvName, options);
          this.notificationService.info("Organisations Test Data Exported.");
        },
        (error) => {
          this.dataFetched = true;
          this.notificationService.warning("Unable to retrieve staff list. You may not have a role to view your organisation's information. Please contact support.");
        }
      );
    }
  }
}
