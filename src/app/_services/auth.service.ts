import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Credentials } from "../_models/ModelUser";
declare var window: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  baseUrl = "auth";
  portnum = "4200";

  constructor(private http: HttpClient) {
    const parsedUrl = window.location.href;
    const origin = parsedUrl;
    this.baseUrl = this.combineURL(origin, this.baseUrl);
  }

  private combineURL(origin: string, subd: string) {
    const domain = origin.split("//")[1].split("/")[0].replace("www", "");
    if (domain.includes("localhost")) {
      return "https://localhost:" + this.portnum + "/";
    } else if (domain.includes("dev") || domain.includes("demo")) {
      return "https://" + subd + domain + "/";
    }
    return "https://" + subd + domain + "/";
  }

  login(credentials: Credentials) {
    return this.http.post(this.baseUrl + "users/authenticate", credentials);
  }

  registerMFA() {
    return this.http.get(this.baseUrl + "mfa/register/");
  }

  verifyMFA(token: string, tempSecret: string) {
    return this.http.post(this.baseUrl + "mfa/verify/", {
      token: token,
      tempSecret: tempSecret,
    });
  }

  validateMFA(token: string) {
    return this.http.post(this.baseUrl + "mfa/validate/", {
      token: token,
    });
  }

  unregisterMFA() {
    return this.http.get(this.baseUrl + "mfa/unregister/");
  }

  checkMFA() {
    return this.http.get(this.baseUrl + "mfa/checkmfa/");
  }

  public checkendpoint() {
    return this.http.get(this.baseUrl, { responseType: "text" });
  }

  public getUserRoles() {
    return this.http.get(this.baseUrl + "userroles/getAll/");
  }

  public getRolesByUsername(username: string) {
    return this.http.get(this.baseUrl + "userroles/getItemsByUsername?username=" + username);
  }

  public registerRole(payload: any) {
    return this.http.post(this.baseUrl + "userroles/register/", payload);
  }

  public registerTeamRole(payload: any) {
    return this.http.post(this.baseUrl + "teamroles/register/", payload);
  }

  public removeUserRole(payload: any) {
    return this.http.post(this.baseUrl + "userroles/remove", payload);
  }

  public removeTeamRole(payload: any) {
    return this.http.post(this.baseUrl + "teamroles/remove", payload);
  }
}
