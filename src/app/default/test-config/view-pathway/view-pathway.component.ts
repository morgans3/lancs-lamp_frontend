import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Pathway } from "../../../_models/pathwayconfig";
import { LAMPService } from "../../../_services/lamp.service";
import { NotificationService } from "../../../_services/notification.service";

@Component({
  selector: "app-view-pathway",
  templateUrl: "./view-pathway.component.html",
  styleUrls: ["./view-pathway.component.scss"],
})
export class ViewPathwayComponent implements OnInit {
  @Input() selectedPathway: any;
  @Output() editPathway = new EventEmitter<Pathway>();
  constructor(private lampService: LAMPService, private notificationService: NotificationService) {}

  ngOnInit() {}

  transform(val: any) {
    return JSON.stringify(val, null, 2).split(" ").join("&nbsp;").split("\n").join("<br/>");
  }

  changeactivity(activity: string) {
    this.selectedPathway.in_use = activity;
    this.lampService.updatePathway(this.selectedPathway).subscribe((data: any) => {
      if (data.err) {
        this.notificationService.warning("Unable to update pathway, reason: " + data.err);
      } else {
        this.notificationService.success("Pathway updated");
      }
    });
  }

  amendPathway(pathway: Pathway) {
    this.editPathway.emit(pathway);
  }
}
