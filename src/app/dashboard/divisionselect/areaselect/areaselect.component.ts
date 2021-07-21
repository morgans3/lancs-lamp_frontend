import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { orgstructures } from "src/app/_models/lamp";
import { LAMPService } from "src/app/_services/lamp.service";

@Component({
  selector: "app-areaselect",
  templateUrl: "./areaselect.component.html",
  styleUrls: ["./areaselect.component.scss"],
})
export class AreaselectComponent implements OnInit, OnChanges {
  @Input() selectedWorkforce: any;
  workforce: any;
  areas: orgstructures[] = [];
  currentLevels: orgstructures[] = [];
  selected: any;
  group: FormGroup = new FormGroup({
    level: new FormControl(null),
  });
  levellist: orgstructures[] = [];
  @Output() selection = new EventEmitter<orgstructures>();

  constructor(private lampService: LAMPService) {}

  ngOnInit() {
    if (this.workforce !== this.selectedWorkforce) {
      this.workforce = this.selectedWorkforce;
      this.getOrgs();
    }
  }

  ngOnChanges() {
    if (this.workforce !== this.selectedWorkforce) {
      this.workforce = this.selectedWorkforce;
      this.getOrgs();
    }
  }

  getOrgs() {
    this.clearSelection();
    this.lampService.getOrgStructuresByOrg({ org: this.workforce }).subscribe((res: any) => {
      this.areas = res;
      this.populatefirstlevel();
    });
  }

  populatefirstlevel() {
    this.levellist = this.areas.filter((x) => x.parent === this.workforce);
  }

  populatenextlevel() {
    this.levellist = this.areas.filter((x) => x.parent === this.selected.id.toString());
  }

  selectLevel(level: orgstructures) {
    this.selected = level;
    this.selection.emit(level);
    this.currentLevels.push(level);
    this.populatenextlevel();
  }

  clearLevel(level: orgstructures) {
    this.group.controls.level.setValue(null);
    const index = this.currentLevels.findIndex((x) => x.id === level.id);
    if (index === -1) {
      this.clearSelection();
    } else {
      this.currentLevels.splice(index, this.currentLevels.length - index);
      if (this.currentLevels.length > 0) {
        this.selected = this.currentLevels[this.currentLevels.length - 1];
        this.populatenextlevel();
      } else {
        this.selected = null;
        this.populatefirstlevel();
      }
      this.selection.emit(this.selected);
    }
  }

  clearSelection() {
    this.group.controls.level.setValue(null);
    this.currentLevels = [];
    this.selected = null;
    this.selection.emit(undefined);
    this.populatefirstlevel();
  }
}
