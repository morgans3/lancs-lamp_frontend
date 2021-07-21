import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngxs/store";
import { LAMPService } from "src/app/_services/lamp.service";
import { NotificationService } from "src/app/_services/notification.service";
import { PatientService } from "src/app/_services/patient.service";

export interface displayedResult {
  observationtime: Date;
  result: string;
  type: string;
}

@Component({
  selector: "app-myresults",
  templateUrl: "./myresults.component.html",
  styleUrls: ["./myresults.component.css"],
})
export class MyresultsComponent implements OnInit {
  setnhsnumber: any;
  consentForm = new FormGroup({
    consentSharing: new FormControl(null),
  });
  @ViewChild(FormGroupDirective)
  formDirective: any;
  form: any;
  results: displayedResult[] = [];
  selectedTest = false;
  validcode = false;
  tokenDecoded: any;
  isStaff = false;
  occupation: any;
  currentState: any;
  staffconsent: any;
  displayedColumns: string[] = ["observationtime", "type", "result"];
  dataSource: any;
  dataFetched = false;
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;
  demographics: any;
  isLAMP = false;
  LAMPlast: any;
  LAMPnext: any;
  globalconsentoverride = false;

  constructor(private lampService: LAMPService, private notificationService: NotificationService, private patientservice: PatientService, private store: Store) {}

  ngOnInit() {
    this.getData();
  }

  setData(dataset: any) {
    this.dataSource = new MatTableDataSource(dataset);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataFetched = true;
  }

  getData() {
    this.validcode = false;
    this.isStaff = false;
    this.currentState = null;
    this.getTestData();
  }

  getTestData() {
    this.results = [];
    this.isLAMP = false;
    this.lampService.getMyTestsResults().subscribe((response: any) => {
      if (response.data && response.data.length > 0) {
        this.isStaff = false;
        this.isLAMP = true;
        response.data.forEach((element: any) => {
          this.results.push({ observationtime: element.requestedDT, result: element.result || "Awaiting Result", type: "LAMP" });
          if (element.occupation.includes("Staff") && !element.occupation.includes("Other")) {
            this.occupation = element.occupation;
            this.isStaff = true;
          }
        });
        if (this.isStaff) {
          this.loadConsentToShare();
        }
        this.reviewResults();
      }
    });
  }

  displayaddress(data: any) {
    let address = "";
    if (data.postcode) {
      if (data.addressline1) address += data.addressline1;
      if (data.addressline2) {
        if (address.length > 0) address += ", ";
        address += data.addressline2;
      }
      if (data.addressline3) {
        if (address.length > 0) address += ", ";
        address += data.addressline3;
      }
      if (data.addressline4) {
        if (address.length > 0) address += ", ";
        address += data.addressline4;
      }
      if (data.addressline5) {
        if (address.length > 0) address += ", ";
        address += data.addressline5;
      }
      if (data.postcode) {
        if (address.length > 0) address += ", ";
        address += data.postcode;
      }
    }
    return address;
  }

  reviewResults() {
    if (this.results.length > 0) {
      this.results = this.results.sort((a, b) => {
        return new Date(b.observationtime).getTime() - new Date(a.observationtime).getTime();
      });
      this.currentState = null;

      if (this.isLAMP) {
        const lastlamp: any = this.results.find((x) => x.type.includes("LAMP"));
        this.LAMPlast = lastlamp.observationtime;
        let nextdays = 7;
        if (lastlamp.result === "POSITIVE") {
          nextdays = 28;
        }
        this.LAMPnext = this.addDays(this.LAMPlast, nextdays);
      }

      const latestres = this.results[0].result;
      if (this.results[0].type === "LAMP") {
        if (latestres.toUpperCase().includes("NEGATIVE")) {
          this.currentState = "Negative";
        } else if (latestres.toUpperCase().includes("POSITIVE")) {
          this.currentState = "Positive";
        }
      }
    }
    this.setData(this.results);
  }

  addDays(date: any, days: any) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  saveConsenttoShare() {
    if (this.staffconsent) {
      this.lampService.updateStaffConsent({ nhsnumber: this.setnhsnumber, consentsharing: this.consentForm.controls.consentSharing.value || false }).subscribe((data: any) => {
        if (data.success && data.success === false) {
          this.notificationService.warning("Unable to update consent to share information. Please contact support.");
        }
      });
    } else {
      this.lampService.registerStaffConsent({ nhsnumber: this.setnhsnumber, consentsharing: this.consentForm.controls.consentSharing.value || false }).subscribe((data: any) => {
        if (data.success && data.success === true) {
          this.staffconsent = data.registered;
        } else {
          this.notificationService.warning("Unable to register consent to share information. Please contact support.");
        }
      });
    }
  }

  loadConsentToShare() {
    if (this.setnhsnumber && this.setnhsnumber.length > 0) {
      this.lampService.getStaffConsentByNHSNumber({ nhsnumber: this.setnhsnumber }).subscribe((data: any) => {
        if (data && data.length > 0) {
          this.staffconsent = data[0];
          this.consentForm.controls.consentSharing.patchValue(data[0].consentsharing);
        }
      });
    }
  }
}
