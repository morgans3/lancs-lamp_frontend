import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { LAMPService } from "src/app/_services/lamp.service";
import { NotificationService } from "../../../_services/notification.service";

@Component({
  selector: "app-Occupations",
  templateUrl: "./Occupations.component.html",
  styleUrls: ["./Occupations.component.css"],
})
export class OccupationsComponent implements OnInit, OnChanges {
  @Input() displayName: any;
  @Input() inputoccupations: any;
  editForm: any;
  displayedColumns: string[] = ["occupation", "order", "createdDT", "actions"];
  dataSource: any;
  dataFetched = false;
  myForm = new FormGroup({
    occupation: new FormControl(null, Validators.required),
    order: new FormControl("0", Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  form: any;
  dataChanged = false;
  @ViewChild(MatPaginator, { static: false }) paginator: any;
  @ViewChild(MatSort, { static: false }) sort: any;
  methods: any[] = [];
  @Output() updatedmethods = new EventEmitter<any[]>();
  type = "";

  constructor(private lampService: LAMPService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.methods = this.inputoccupations;
    this.buildTable();
  }

  ngOnChanges() {
    if (this.methods !== this.inputoccupations) {
      this.methods = this.inputoccupations;
      this.buildTable();
    }
  }

  buildTable() {
    if (this.displayName === "Census Occupations") {
      this.type = "_census";
    } else {
      this.type = "";
    }
    this.dataFetched = true;
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.methods;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSubmit() {
    if (this.editForm) {
      const updateItem = this.methods.filter((x) => x.occupation === this.myForm.value["occupation"]);
      if (updateItem.length > 0) {
        updateItem[0].order = this.myForm.value["order"];
        this.lampService.updateOccupations(updateItem[0], this.type).subscribe((data: any) => {
          this.methods.splice(this.methods.indexOf(this.methods.filter((x) => x.occupation === this.myForm.value["occupation"])[0]), 1, updateItem[0]);
          this.buildTable();
          this.notificationService.success("Updated record");
          this.formDirective.resetForm();
          this.myForm.controls["order"].setValue("0");
          this.editForm = null;
          this.updatedmethods.emit(updateItem);
        });
      } else {
        this.notificationService.error("Unable to update occupation name. To change the occupation you will need to add a new occupation and remove the previous one.");
      }
    } else {
      const item = this.myForm.value;
      item.createdDT = new Date().toISOString();
      this.lampService.addOccupations(item, this.type).subscribe((data: any) => {
        item.createdDT = new Date().toISOString();
        this.methods.push(item);
        this.buildTable();
        this.formDirective.resetForm();
        this.myForm.controls["order"].setValue("0");
        this.updatedmethods.emit([item]);
      });
    }
  }

  exitEditMode() {
    this.editForm = null;
    this.formDirective.resetForm();
    this.myForm.controls["order"].setValue("0");
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateRecord(row: any) {
    this.editForm = row;
    this.myForm.patchValue(this.editForm);
  }

  removeRecord(row: any) {
    this.lampService.removeOccupations(row, this.type).subscribe((res: any) => {
      if (res.error) {
        this.notificationService.warning("Unable to remove occupation, reason: " + res.message);
      } else {
        this.notificationService.success("Occupation removed");
        this.methods.splice(this.methods.indexOf(row));
        this.buildTable();
        this.updatedmethods.emit(undefined);
      }
    });
  }

  trunc(word: any, n: any) {
    return word.length > n ? word.substr(0, n - 1) + "..." : word;
  }
}
