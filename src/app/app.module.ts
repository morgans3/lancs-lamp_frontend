import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from "@angular/common/http";
import { LocationStrategy, PathLocationStrategy } from "@angular/common";
import { AppRoutes } from "./app.routing";
import { AppComponent } from "./app.component";

import { FlexLayoutModule } from "@angular/flex-layout";
import { FullComponent } from "./layouts/full/full.component";
import { AppHeaderComponent } from "./layouts/full/header/header.component";
import { AppSidebarComponent } from "./layouts/full/sidebar/sidebar.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DemoMaterialModule } from "./demo-material-module";

import { SharedModule } from "./shared/shared.module";
import { SpinnerComponent } from "./shared/spinner.component";
import { SpeedDialFabComponent } from "./speed-dial-fab/speed-dial-fab.component";
import { NgxsModule } from "@ngxs/store";
import { NgxsEmitPluginModule } from "@ngxs-labs/emitter";
import { NgxsLoggerPluginModule } from "@ngxs/logger-plugin";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsResetPluginModule } from "ngxs-reset-plugin";
import { NgxsStoragePluginModule, StorageOption } from "@ngxs/storage-plugin";
import { ReferenceState } from "./_states/reference.state";
import { AuthState } from "./_states/auth.state";
import { AuthService } from "./_services/auth.service";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { ReferenceService } from "./_services/reference.service";
import { RoleGuard } from "./_guards/role.guard";
import { AuthGuard } from "./_guards/auth.guard";
import { NotificationService } from "./_services/notification.service";
import { RequestInterceptor } from "./_services/requestinterceptor.service";
import { ToastrModule } from "ngx-toastr";
import { SigninComponent } from "./layouts/full/signin/signin.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LAMPService } from "./_services/lamp.service";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { LeafletMarkerClusterModule } from "@asymmetrik/ngx-leaflet-markercluster";
import { PostcodeService } from "./_services/postcodes.service";
import { PatientService } from "./_services/patient.service";

@NgModule({
  declarations: [SigninComponent, AppComponent, FullComponent, AppHeaderComponent, SpinnerComponent, AppSidebarComponent, SpeedDialFabComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    NgxsModule.forRoot([AuthState, ReferenceState], {
      developmentMode: !true,
    }),
    NgxsStoragePluginModule.forRoot({
      storage: StorageOption.LocalStorage,
    }),
    NgxsResetPluginModule.forRoot(),
    // NgxsRouterPluginModule.forRoot(),
    NgxsEmitPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: true,
    }),
    NgxsLoggerPluginModule.forRoot({
      disabled: true,
    }),
    ToastrModule.forRoot({
      timeOut: 4000,
      positionClass: "toast-bottom-full-width",
      preventDuplicates: true,
    }),
    ReactiveFormsModule,
    FontAwesomeModule,
    LeafletModule,
    LeafletMarkerClusterModule,
  ],
  providers: [
    AuthService,
    NotificationService,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    AuthGuard,
    RoleGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    ReferenceService,
    LAMPService,
    PostcodeService,
    PatientService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
