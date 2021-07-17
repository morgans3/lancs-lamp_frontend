import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { speedDialFabAnimations } from "../shared/animations";

@Component({
  selector: "app-speed-dial-fab",
  templateUrl: "./speed-dial-fab.component.html",
  styleUrls: ["./speed-dial-fab.component.scss"],
  animations: speedDialFabAnimations,
})
export class SpeedDialFabComponent {
  token: any;
  tokenDecoded: any;
  fabButtons = [
    {
      icon: "refresh",
      tooltip: "Refresh Content",
    },
    {
      icon: "reply",
      tooltip: "Go Back",
    },
  ];
  buttons: any[] = [];
  fabTogglerState = "inactive";

  constructor(private _location: Location) {}

  clickEvents(button: string) {
    switch (button) {
      case "refresh":
        location.reload();
        break;
      case "reply":
        this._location.back();
        break;
    }
    this.hideItems();
  }

  showItems() {
    this.fabTogglerState = "active";
    this.buttons = this.fabButtons;
  }

  hideItems() {
    this.fabTogglerState = "inactive";
    this.buttons = [];
  }

  onToggleFab() {
    this.buttons.length ? this.hideItems() : this.showItems();
  }
}
