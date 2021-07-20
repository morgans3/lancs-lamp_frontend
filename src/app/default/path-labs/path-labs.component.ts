import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { NotificationService } from "../../_services/notification.service";
import { AuthState } from "../../_states/auth.state";
import { LAMPService } from "../../_services/lamp.service";
import { PathLabs } from "../../_models/lamp";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-path-labs",
  templateUrl: "./path-labs.component.html",
  styleUrls: ["./path-labs.component.scss"],
})
export class PathLabsComponent implements OnInit {
  refreshDT = new Date();
  displayedColumns: string[] = ["lab", "organisation", "createdDT", "namedContact", "npexCode", "actions"];
  dataSource: any;
  dataFetched = true;
  @ViewChild(MatPaginator, { static: false }) paginator: any;
  @ViewChild(MatSort, { static: false }) sort: any;
  tokenDecoded: any;
  formmode = false;
  rowToEdit: any;
  pathlabs: PathLabs[] = [];

  constructor(private lampService: LAMPService, private router: Router, public store: Store, private notificationService: NotificationService) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.dataFetched = false;
    this.lampService.getPathlabs().subscribe((data: any) => {
      this.pathlabs = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataFetched = true;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateRecord(row: PathLabs) {
    this.formmode = true;
    document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
    this.rowToEdit = row;
  }

  removeRecord(row: PathLabs) {
    this.lampService.removePathLab(row).subscribe((res: any) => {
      if (res.error) {
        this.notificationService.warning("Unable to remove Lab, reason: " + res.message);
      } else {
        this.notificationService.success("Path Lab removed");
        this.getData();
      }
    });
  }

  trunc(word: any, n: any) {
    return word.length > n ? word.substr(0, n - 1) + "..." : word;
  }

  newForm() {
    this.rowToEdit = null;
    this.formmode = true;
    document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
  }

  formUpdated(details: any) {
    this.formmode = false;
    if (details === null) {
      this.rowToEdit = null;
    } else {
      this.lampService.updatePathLab(details).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Updated Lab Information");
          this.getData();
        } else {
          this.notificationService.error("Unable to update lab, reason: " + res.msg);
        }
      });
    }
  }

  formAdded(details: any) {
    this.formmode = false;
    if (details !== null) {
      this.lampService.addPathLab(details).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Added Lab Information");
          this.getData();
        } else {
          this.notificationService.error("Unable to add lab, reason: " + res.msg);
        }
      });
    }
  }
}
