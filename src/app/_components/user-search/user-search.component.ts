import { Component, Output, EventEmitter } from "@angular/core";
import { FullUser } from "../../_models/ModelUser";
import { Organisation } from "../../_models/ModelOrganisation";
import { Store } from "@ngxs/store";
import { ReferenceState } from "../../_states/reference.state";
import { AuthState } from "../../_states/auth.state";
import { JwtHelperService } from "@auth0/angular-jwt";

export interface SearchResults {
  name: string;
  results: Section[];
}
export interface Section {
  name: string;
  email: string;
  username: string;
}

@Component({
  selector: "app-user-search",
  templateUrl: "./user-search.component.html",
  styleUrls: ["./user-search.component.scss"],
})
export class UserSearchComponent {
  organisation: any;
  organisations: Organisation[] = [];
  teamresults: Section[] = [];
  searching = false;
  @Output() search = new EventEmitter<FullUser>();
  tokenDecoded: any;

  constructor(public store: Store) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
    }
    this.store.select(ReferenceState.getOrganisations).subscribe((res: Organisation[]) => {
      this.organisations = res;
      this.setDefaultOrg();
    });
  }

  setDefaultOrg() {
    if (this.organisations) {
      const myorg = this.organisations.find((x) => x.name === this.tokenDecoded.organisation);
      if (myorg) {
        this.organisation = myorg;
      } else {
        this.organisation = this.organisations[0];
      }
    }
  }

  onSearchChangeTeamList(searchValue: string) {
    if (searchValue.length > 4) {
      this.searching = true;
      // this.userGroupService.searchOrgUserProfiles(searchValue, this.organisation.authmethod).subscribe((response: SearchResults[]) => {
      //   this.searching = false;
      //   this.teamresults = response[0].results;
      // });
    } else {
      this.teamresults = [];
    }
  }

  selectUser(user: FullUser) {
    this.search.emit(user);
  }
}
