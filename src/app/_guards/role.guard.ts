import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";

import { AuthState } from "../_states/auth.state";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { NotificationService } from "../_services/notification.service";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(private notificationService: NotificationService, private store: Store) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data.roles as Array<string>;
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      const tokenDecoded = jwtHelper.decodeToken(token);
      if (tokenDecoded && tokenDecoded.roles && tokenDecoded.roles.filter((x: any) => x[roles[0]] && x[roles[0]] !== "deny").length > 0) {
        return true;
      } else {
        this.notificationService.error("Unauthorised!  You do not have the required permissions to view this Page");
        return false;
      }
    }
    this.notificationService.error("Unauthorised!  You do not have the required permissions to view this Page");
    return false;
  }
}
