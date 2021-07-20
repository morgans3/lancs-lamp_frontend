import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { LAMPService } from "../../_services/lamp.service";
import { Angular2Csv } from "angular2-csv/Angular2-csv";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"],
})
export class ResultsComponent implements OnInit {
  displayedColumns: string[] = ["pathwayname", "barcode_value", "requestedDT", "result"];
  dataSource: any;
  dataFetched = true;
  myForm = new FormGroup({
    organisation: new FormControl(null, Validators.required),
    startdate: new FormControl(null, Validators.required),
    enddate: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  @ViewChild(MatPaginator, { static: false }) paginator: any;
  @ViewChild(MatSort, { static: false }) sort: any;
  organisations: any[] = [];
  csv: any;

  constructor(private lampService: LAMPService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getOrganisations();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getOrganisations() {
    this.lampService.getOccupations().subscribe((data: any) => {
      this.organisations = data;
    });
  }

  onSubmit() {
    this.dataFetched = false;
    const payload = {
      occupation: this.myForm.controls["organisation"].value,
      startdate: this.myForm.controls["startdate"].value,
      enddate: this.myForm.controls["enddate"].value,
      limit: "999999",
    };
    this.lampService.getPathwayDataByOccupationAndTime(payload).subscribe((data: any) => {
      this.dataSource = new MatTableDataSource();
      this.csv = data;
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataFetched = true;
    });
  }

  download() {
    const today = new Date();
    const csvName = "TestResults-" + this.myForm.controls["organisation"].value + "-" + today.getFullYear() + (today.getMonth() + 1) + today.getDate();
    const options = {
      title: csvName,
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalseparator: ".",
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: ["id", "nhs_number", "barcode_value", "requestedDT", "requested", "pathwayid", "xds_document_name", "intended_location", "citizen_preferred_email", "citizen_preferred_mobile", "result", "notify_citizenDT", "occupation", "consentgiven", "consentgivendirectcare", "consentgivenresearch", "s3_filename", "lambdaDT", "date_of_birth", "pathwayname", "consent", "registeredusername", "title", "forename", "otherforenames", "surname", "postcode", "gender", "address"],
    };
    const file = new Angular2Csv(this.csv, csvName, options);
  }
}
