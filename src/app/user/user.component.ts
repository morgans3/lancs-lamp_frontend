import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { LAMPService } from "../_services/lamp.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  safeURL: any;
  embedHeight = 375;
  embedWidth = 500;
  VideoLinks: any;
  sections: string[] = [];

  constructor(private _sanitizer: DomSanitizer, private lampService: LAMPService) {}

  ngOnInit() {
    this.getLinks();
  }

  getLinks() {
    this.lampService.getTrainingResources().subscribe((data: any) => {
      if (data.length > 0) {
        this.populateSections(data);
      }
    });
  }

  getVideoLinks(section: string) {
    return this.VideoLinks.filter((x: any) => x.section === section);
  }

  populateSections(data: any) {
    data.forEach((link: any) => {
      if (this.sections.indexOf(link.section) < 0) {
        this.sections.push(link.section);
      }
    });
    this.sections = this.sections.sort().reverse();
    this.VideoLinks = data;
    this.updateLink(this.VideoLinks[0].url);
  }

  updateLink(newlink: any) {
    this.safeURL = this._sanitizer.bypassSecurityTrustResourceUrl(newlink);
  }
}
