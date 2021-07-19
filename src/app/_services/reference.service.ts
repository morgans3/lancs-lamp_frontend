import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Organisation } from "../_models/ModelOrganisation";
declare var window: any;

@Injectable({
  providedIn: "root",
})
export class ReferenceService {
  baseUrl = "reference";
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

  public getOrganisations() {
    return this.http.get(this.baseUrl + "organisation/getAll");
  }

  public addOrganisation(payload: Organisation) {
    return this.http.post(this.baseUrl + "organisation/register/", payload);
  }

  public updateOrganisation(payload: Organisation, id: string) {
    return this.http.put(this.baseUrl + "organisation/update?organisation_id=" + id, payload);
  }
}
