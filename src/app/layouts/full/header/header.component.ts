import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent {
  constructor(private router: Router) {}
  navigateTo(area: string) {
    this.router.navigateByUrl("/" + area);
  }
}
