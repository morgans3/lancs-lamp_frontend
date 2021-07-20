import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LAMPService } from "../../../_services/lamp.service";
import { NotificationService } from "../../../_services/notification.service";

@Component({
  selector: "app-admin-trainingresources",
  templateUrl: "./admin-trainingresources.component.html",
  styleUrls: ["./admin-trainingresources.component.scss"],
})
export class AdminTrainingresourcesComponent implements OnInit {
  displayedColumns: string[] = ["name", "order", "section", "url", "actions"];
  dataSource: any;
  dataFetched = false;
  myForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    url: new FormControl(null, Validators.required),
    order: new FormControl(null, Validators.required),
    section: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  @ViewChild(MatPaginator, { static: false }) paginator: any;
  @ViewChild(MatSort, { static: false }) sort: any;

  constructor(private lampService: LAMPService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.dataFetched = false;
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getData();
  }

  getData() {
    this.dataFetched = false;
    this.lampService.getTrainingResources().subscribe((data: any) => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataFetched = true;
    });
  }

  onSubmit() {
    this.lampService.addTrainingResource(this.myForm.value).subscribe((data: any) => {
      if (data.err) {
        this.notificationService.warning("Unable to add record");
      } else {
        this.notificationService.success("Added Item");
        this.getData();
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  remove(row: any) {
    this.lampService.removeTrainingResource(row).subscribe((data: any) => {
      if (data.err) {
        this.notificationService.warning("Unable to remove record");
      } else {
        this.notificationService.success("Removed Item");
        this.getData();
      }
    });
  }
}
