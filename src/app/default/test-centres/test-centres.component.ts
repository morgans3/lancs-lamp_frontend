import { Component, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngxs/store";
import { NotificationService } from "../../_services/notification.service";
import { AuthState } from "../../_states/auth.state";
import { LAMPService } from "../../_services/lamp.service";
import { PathLabs, TestCentre } from "../../_models/lamp";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { JwtHelperService } from "@auth0/angular-jwt";

@Component({
  selector: "app-test-centres",
  templateUrl: "./test-centres.component.html",
  styleUrls: ["./test-centres.component.scss"],
})
export class TestCentresComponent implements OnInit {
  refreshDT = new Date();
  displayedColumns: string[] = ["testcentre", "opening", "closing", "owner", "pathlab", "actions"];
  dataSource: any;
  dataFetched = true;
  @ViewChild(MatPaginator, { static: false }) paginator: any;
  @ViewChild(MatSort, { static: false }) sort: any;
  tokenDecoded: any;
  formmode = false;
  rowToEdit: any;
  testCentres: TestCentre[] = [];
  pathLabs: PathLabs[] = [];

  constructor(private lampService: LAMPService, public store: Store, private notificationService: NotificationService) {
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
    this.lampService.getTestCentres().subscribe((data: any) => {
      this.testCentres = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataFetched = true;
    });
    this.lampService.getPathlabs().subscribe((data: any) => {
      this.pathLabs = data;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateRecord(row: TestCentre) {
    this.formmode = true;
    document.getElementsByTagName("mat-sidenav-content")[0].scrollTo(0, 0);
    this.rowToEdit = row;
  }

  removeRecord(row: TestCentre) {
    this.lampService.removeTestCentre(row).subscribe((res: any) => {
      if (res.error) {
        this.notificationService.warning("Unable to remove Test Centre, reason: " + res.message);
      } else {
        this.notificationService.success("Test Centre removed");
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
      if (details.closing === null) {
        delete details.closing;
      }
      this.lampService.updateTestCentre(details).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Updated Test Centre Information");
          this.getData();
        } else {
          this.notificationService.error("Unable to update test centre, reason: " + res.msg);
        }
      });
    }
  }

  formAdded(details: any) {
    this.formmode = false;
    if (details !== null) {
      this.lampService.addTestCentre(details).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Added Test Centre Information");
          this.getData();
        } else {
          this.notificationService.error("Unable to add test centre, reason: " + res.msg);
        }
      });
    }
  }

  getLabName(npexCode: string) {
    if (this.pathLabs && this.pathLabs.length > 0) {
      const lab = this.pathLabs.filter((x) => x.npexCode === npexCode);
      if (lab.length > 0) {
        return lab[0].lab;
      } else {
        return npexCode;
      }
    } else {
      return npexCode;
    }
  }
}
