import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Pathway } from "../_models/pathwayconfig";
declare var window: any;

@Injectable({
  providedIn: "root",
})
export class LAMPService {
  baseUrl = "api";
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

  public getTestCentres() {
    return this.http.get(this.baseUrl + "testcentre/getAll");
  }

  public addTestCentre(payload: any) {
    return this.http.post(this.baseUrl + "testcentre/register/", payload);
  }

  public updateTestCentre(payload: any) {
    return this.http.post(this.baseUrl + "testcentre/update/", payload);
  }

  public removeTestCentre(payload: any) {
    return this.http.post(this.baseUrl + "testcentre/remove/", payload);
  }

  public getTestCentre(payload: any) {
    return this.http.post(this.baseUrl + "testcentre/gettestcentre/", payload);
  }

  public getOpenTestCentres() {
    return this.http.get(this.baseUrl + "testcentre/getOpenTestCentres/");
  }

  public getPathlabs() {
    return this.http.get(this.baseUrl + "pathlabs/getAll");
  }

  public addPathLab(payload: any) {
    return this.http.post(this.baseUrl + "pathlabs/register/", payload);
  }

  public updatePathLab(payload: any) {
    return this.http.post(this.baseUrl + "pathlabs/update/", payload);
  }

  public removePathLab(payload: any) {
    return this.http.post(this.baseUrl + "pathlabs/remove/", payload);
  }

  public getPathLab(payload: any) {
    return this.http.post(this.baseUrl + "pathlabs/getlab/", payload);
  }

  public checkendpoint() {
    return this.http.get(this.baseUrl, { responseType: "text" });
  }

  public getComponentTypes() {
    return this.http.get(this.baseUrl + "componenttypes/getAll/");
  }

  public getPathways() {
    return this.http.get(this.baseUrl + "pathways/getAll/");
  }

  public addPathway(payload: Pathway) {
    return this.http.post(this.baseUrl + "pathways/register/", payload);
  }

  public updatePathway(payload: Pathway) {
    return this.http.post(this.baseUrl + "pathways/update/", payload);
  }

  public getTrainingResources() {
    return this.http.get(this.baseUrl + "trainingresources/getAll/");
  }

  public addTrainingResource(payload: any) {
    return this.http.post(this.baseUrl + "trainingresources/register/", payload);
  }

  public removeTrainingResource(payload: any) {
    return this.http.post(this.baseUrl + "trainingresources/remove/", payload);
  }

  public getRegisteredStaff() {
    return this.http.get(this.baseUrl + "registerstaff/getAll/");
  }

  public addRegisteredStaff(payload: any) {
    return this.http.post(this.baseUrl + "registerstaff/register/", payload);
  }

  public removeRegisteredStaff(payload: any) {
    return this.http.post(this.baseUrl + "registerstaff/remove/", payload);
  }

  public getRegisteredStaffByEmail(payload: any) {
    return this.http.post(this.baseUrl + "registerstaff/getByEmail/", payload);
  }

  public getRegisteredStaffByUsername(payload: any) {
    return this.http.post(this.baseUrl + "registerstaff/getByUsername/", payload);
  }

  public completeTraining(payload: any) {
    return this.http.post(this.baseUrl + "training/completeTraining/", payload);
  }

  public isTrainingComplete(username: string, org: string) {
    const payload = { username: username, organisation: org };
    return this.http.post(this.baseUrl + "training/isTrainingComplete/", payload);
  }

  public getMyTests(username: string, org: string) {
    const payload = { username: username, organisation: org };
    return this.http.post(this.baseUrl + "testrequests/getMyTests/", payload);
  }

  public updateHealthInfo(payload: any) {
    return this.http.post(this.baseUrl + "registerstaff/updateHealthInfo/", payload);
  }

  public loadHealthInfo() {
    return this.http.get(this.baseUrl + "registerstaff/loadHealthInfo/");
  }

  public loadStaffConsent() {
    return this.http.get(this.baseUrl + "staffconsent/getAll/");
  }

  public registerStaffConsent(payload: any) {
    return this.http.post(this.baseUrl + "staffconsent/register/", payload);
  }

  public removeStaffConsent(payload: any) {
    return this.http.post(this.baseUrl + "staffconsent/remove/", payload);
  }

  public getStaffConsentByNHSNumber(payload: any) {
    return this.http.post(this.baseUrl + "staffconsent/getByNHSNumber/", payload);
  }

  public updateStaffConsent(payload: any) {
    return this.http.post(this.baseUrl + "staffconsent/update/", payload);
  }

  public getPathwayDataByOccupation(payload: any) {
    return this.http.post(this.baseUrl + "pathwaydata/getByOccupation/", payload);
  }

  public getPathwayDataByOccupationAndTime(payload: any) {
    return this.http.post(this.baseUrl + "pathwaydata/getByOccupationAndTime/", payload);
  }

  public getPathwayDataPositives() {
    return this.http.get(this.baseUrl + "pathwaydata/getPositives/");
  }

  public getPathwayDataAll() {
    return this.http.get(this.baseUrl + "pathwaydata/getAll/");
  }

  public getOrgAcknowledgements() {
    return this.http.get(this.baseUrl + "orgacknowledgements/getAll/");
  }

  public addOrgAcknowledgements(payload: any) {
    return this.http.post(this.baseUrl + "orgacknowledgements/register/", payload);
  }

  public removeOrgAcknowledgements(payload: any) {
    return this.http.post(this.baseUrl + "orgacknowledgements/remove/", payload);
  }

  public getOrgAcknowledgementsByOrg(payload: any) {
    return this.http.post(this.baseUrl + "orgacknowledgements/getbyorg/", payload);
  }

  public getOrgStructures() {
    return this.http.get(this.baseUrl + "orgstructures/getAll/");
  }

  public addOrgStructures(payload: any) {
    return this.http.post(this.baseUrl + "orgstructures/register/", payload);
  }

  public updateOrgStructures(payload: any) {
    return this.http.post(this.baseUrl + "orgstructures/update/", payload);
  }

  public removeOrgStructures(payload: any) {
    return this.http.post(this.baseUrl + "orgstructures/remove/", payload);
  }

  public getOrgStructuresByOrg(payload: any) {
    return this.http.post(this.baseUrl + "orgstructures/getbyorg/", payload);
  }

  public getStaffAreas() {
    return this.http.get(this.baseUrl + "staffarea/getAll/");
  }

  public addStaffAreas(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/register/", payload);
  }

  public updateStaffAreas(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/update/", payload);
  }

  public removeStaffAreas(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/remove/", payload);
  }

  public getStaffAreasByOrg(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/getbyorg/", payload);
  }

  public getStaffAreasByNHSNumber(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/getbynhsnumber/", payload);
  }

  public getStaffAreasByArea(payload: any) {
    return this.http.post(this.baseUrl + "staffarea/getbyarea/", payload);
  }

  // Lists

  public getOccupations() {
    return this.http.get(this.baseUrl + "lists/getOccupations");
  }

  public getCensusOccupations() {
    return this.http.get(this.baseUrl + "lists/getCensusOccupations");
  }

  public addOccupations(payload: any, type: string) {
    return this.http.post(this.baseUrl + "lists/register" + type + "_occupation/", payload);
  }

  public updateOccupations(payload: any, type: string) {
    return this.http.post(this.baseUrl + "lists/update" + type + "_occupation/", payload);
  }

  public removeOccupations(payload: any, type: string) {
    return this.http.post(this.baseUrl + "lists/remove" + type + "_occupation/", payload);
  }

  // Support
  public addSupportRequest(payload: any) {
    return this.http.post(this.baseUrl + "support/register/", payload);
  }

  // Results
  public getMyTestsResults() {
    return this.http.get(this.baseUrl + "results/getmytestresults");
  }
}
