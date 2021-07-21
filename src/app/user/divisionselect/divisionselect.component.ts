import { Component, Input, OnInit } from "@angular/core";
import { LAMPService } from "src/app/_services/lamp.service";
import { orgstructures, staffarea } from "../../_models/lamp";
import { NotificationService } from "../../_services/notification.service";

@Component({
  selector: "app-divisionselect",
  templateUrl: "./divisionselect.component.html",
  styleUrls: ["./divisionselect.component.scss"],
})
export class DivisionselectComponent implements OnInit {
  @Input() selectedWorkforce: any;
  @Input() nhsnumber: any;
  @Input() username?: any;
  areas: orgstructures[] = [];
  currentLevels: orgstructures[] = [];
  selected: any;
  myareas: staffarea[] = [];
  constructor(private lampService: LAMPService, private notificationService: NotificationService) {}

  ngOnInit() {
    this.getMyWorkAreas();
  }

  getMyWorkAreas() {
    this.lampService.getStaffAreasByNHSNumber({ nhsnumber: this.nhsnumber }).subscribe((res: any) => {
      this.myareas = res;
    });
  }

  updateSelected(area: orgstructures) {
    this.selected = area;
  }

  allocateStaff() {
    if (this.selected) {
      const payload: staffarea = {
        id: 0,
        nhsnumber: this.nhsnumber,
        username: this.username,
        organisation: this.selectedWorkforce,
        areaid: this.selected.id,
      };
      this.lampService.addStaffAreas(payload).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Allocation to this area successful. You can allocate to more areas or click done to close this selection.");
          this.getMyWorkAreas();
        } else {
          this.notificationService.warning("Unable to allocate to this area.");
        }
      });
    }
  }

  removeArea(level: staffarea) {
    this.lampService.removeStaffAreas(level).subscribe((res: any) => {
      if (res.success) {
        this.notificationService.success("Allocation to this area removed successful.");
        this.getMyWorkAreas();
      } else {
        this.notificationService.warning("Unable to remove allocation to this area.");
      }
    });
  }
}
