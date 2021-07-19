import { Component, AfterViewInit, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Organisation } from "../../../_models/ModelOrganisation";
import { NotificationService } from "../../../_services/notification.service";
import { AuthState, ManualSetAuthTokens } from "../../../_states/auth.state";
import { UpdateOrganisations } from "../../../_states/reference.state";
import { ReferenceService } from "src/app/_services/reference.service";
import { AuthService } from "src/app/_services/auth.service";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.scss"],
})
export class SigninComponent implements OnInit, AfterViewInit {
  unauthenticated = false;
  tokenDecoded: any;
  attempts = 0;
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    organisation: new FormControl("", Validators.required),
  });
  organisations: Organisation[] = [];
  faSpinner = faSpinner;
  devenv = false;

  constructor(private notificationService: NotificationService, private authService: AuthService, private router: Router, private store: Store, private referenceService: ReferenceService) {
    if (!environment.production) this.devenv = true;
  }

  ngOnInit() {
    this.getOrganisations();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.tokenlogin();
    }, 1000);
  }

  getOrganisations() {
    this.referenceService.getOrganisations().subscribe((data: any) => {
      this.organisations = data;
      this.store.dispatch(new UpdateOrganisations(data));
    });
  }

  login() {
    const credentials = {
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      organisation: this.loginForm.value.organisation.name,
      authentication: this.loginForm.value.organisation.authmethod,
    };
    localStorage.clear();
    this.authService.login(credentials).subscribe(
      (success: any) => {
        this.store.dispatch(new ManualSetAuthTokens(success));
        this.router.navigate(["/pathways"]);
      },
      (error) => {
        this.unauthenticated = true;
        setTimeout(() => this.notificationService.error(error));
      }
    );
  }

  tokenlogin() {
    if (localStorage.getItem("@@token") && localStorage.getItem("@@token") !== null) {
      const token = localStorage.getItem("@@token") || "";
      this.store.dispatch(
        new ManualSetAuthTokens({
          success: true,
          token: JSON.parse(token).stateauth.token,
        })
      );
    }
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      const jwtHelper = new JwtHelperService();
      this.tokenDecoded = jwtHelper.decodeToken(token);
      this.router.navigate(["/pathways"]);
    } else {
      if (this.attempts < 5) {
        setTimeout(() => {
          console.log("Attempt to auto-login: " + this.attempts.toString());
          this.tokenlogin();
        }, 1000);
        this.attempts++;
      } else {
        console.log("Failed to auto-login");
        this.unauthenticated = true;
      }
    }
  }

  demoLogin() {
    const example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    this.store.dispatch(
      new ManualSetAuthTokens({
        success: true,
        token: example,
      })
    );
    this.router.navigate(["/pathways"]);
  }
}
