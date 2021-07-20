import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LAMPService } from "src/app/_services/lamp.service";

interface occ {
  list: any;
  displayname: string;
}

@Component({
  selector: "app-Admin",
  templateUrl: "./Admin.component.html",
  styleUrls: ["./Admin.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminComponent implements OnInit {
  fulllist: occ[] = [
    {
      list: [],
      displayname: "Occupations",
    },
    {
      list: [],
      displayname: "Census Occupations",
    },
  ];
  constructor(private lampService: LAMPService) {}

  ngOnInit() {
    this.getLists();
  }

  getLists() {
    this.lampService.getOccupations().subscribe((data: any) => {
      if (data.length > 0) {
        const occ_list = this.fulllist.find((x) => x.displayname === "Occupations") || this.fulllist[0];
        occ_list.list = data;
      }
    });
    this.lampService.getCensusOccupations().subscribe((data: any) => {
      if (data.length > 0) {
        const occ_list = this.fulllist.find((x) => x.displayname === "Census Occupations") || this.fulllist[1];
        occ_list.list = data;
      }
    });
  }

  updatelists(event?: any) {
    if (event) {
      // this.notificationService.success("List updated");
    }
  }
}
