import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
declare var window: any;

@Injectable({
  providedIn: "root",
})
export class PatientService {
  baseUrl = "patient";
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

  public checkendpoint() {
    return this.http.get(this.baseUrl, { responseType: "text" });
  }

  public findMyNHSNumber(payload: any) {
    return this.http.post(this.baseUrl + "demographics/findMyNHSNumber/", payload);
  }

  public findMyNHSNumberfromSpine(payload: any) {
    return this.http.post(this.baseUrl + "pdsdemographics/findMyNHSNumber/", payload);
  }

  public getSpinePatientDemographics(payload: any) {
    return this.http.post(this.baseUrl + "pdsdemographics/demographicsbynhsnumber", payload);
  }

  // PDS Cache
  public getPDSCache(payload: any) {
    return this.http.post(this.baseUrl + "pdscache/checkcache/", payload);
  }

  public savePDSCache(payload: any) {
    return this.http.post(this.baseUrl + "pdscache/updatecache/", payload);
  }
}
