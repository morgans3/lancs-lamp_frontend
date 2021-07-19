import { AuthState, Logout } from "../_states/auth.state";
import { BehaviorSubject, throwError } from "rxjs";
import { HttpErrorResponse, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, filter, switchMap, take } from "rxjs/operators";

import { Injectable } from "@angular/core";
import { NotificationService } from "./notification.service";
import { Store } from "@ngxs/store";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
  model: any = {};
  lastRequest: any = null;

  constructor(private notificationService: NotificationService, public store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // if (request !== this.lastRequest) {
    this.lastRequest = request;
    return next.handle(this.addTokenToRequest(request, this.store.selectSnapshot(AuthState.getToken))).pipe(
      catchError((err) => {
        if (err.error instanceof ErrorEvent) {
        }
        if (err instanceof HttpErrorResponse) {
          if (err.status === 403) {
            this.notificationService.error("Insufficent privileges");
            return throwError(err.statusText);
          }
          if (err.status === 401) {
            return this.handle401Error(request, next);
          }

          const applicationError = err.headers.get("Application-Error");
          if (applicationError) {
            if (applicationError === "Invalid refresh token") {
              this.store.dispatch(new Logout());
            } else {
              this.notificationService.error(applicationError);
              return throwError(applicationError);
            }
          }

          const serverError = err.error;
          let modelStateErrors = "";
          if (serverError && typeof serverError === "object") {
            for (const key in serverError) {
              if (serverError[key]) {
                modelStateErrors += serverError[key] + "\n";
              }
            }
          }
          this.notificationService.error("Connection to Server Error");
          return throwError(modelStateErrors || serverError || "Server Error");
        } else {
          return throwError(err);
        }
      })
    );
    // }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (request.url.includes("rss2json.com") || request.url.includes("postcodes.io")) {
      return request;
    }
    return request.clone({
      headers: new HttpHeaders({
        Authorization: "JWT " + `${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
        "Access-Control-Allow-Origin": "*",
      }),
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    this.isRefreshingToken = false;

    return this.tokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => {
        return next.handle(this.addTokenToRequest(request, token));
      })
    );
  }
}
