import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { Logout } from "src/app/_states/auth.state";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: [],
})
export class AppHeaderComponent {
  constructor(private router: Router, public store: Store) {}
  navigateTo(area: string) {
    this.router.navigateByUrl("/" + area);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigateByUrl("/");
  }
}
