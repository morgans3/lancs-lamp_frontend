import { Action, Selector, State, StateContext } from "@ngxs/store";
import { ModelUser, Credentials } from "../_models/ModelUser";
// import { AuthService } from "../_services/auth.service";

export class AuthStateModel {
  user!: ModelUser;
}

// export class Login {
//   static readonly type = "[Auth] Login";
//   constructor(public payload: Credentials) {}
// }

export class Logout {
  static readonly type = "[Auth] Logout";
  constructor() {}
}

export class ManualSetAuthTokens {
  static readonly type = "[Auth] ManualSetAuthTokens";
  constructor(public payload: ModelUser) {}
}

@State<ModelUser>({
  name: "stateauth",
})
export class AuthState {
  @Selector()
  static getToken(state: ModelUser) {
    return state.token || "";
  }

  @Selector()
  static getEmail(state: ModelUser) {
    let email = "";
    const token: string | undefined = state.token;
    if (token) {
      const jwtData = token.split(".")[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      email = decodedJwtData.email;
      return email;
    } else return null;
  }

  constructor() {}

  @Action(ManualSetAuthTokens)
  manualSetAuthTokens({ patchState }: StateContext<ModelUser>, { payload }: ManualSetAuthTokens) {
    patchState({
      token: payload.token,
    });
  }

  // @Action(Login)
  // login({ patchState }: StateContext<ModelUser>, { payload }: Login) {
  //   this.authService.login(payload).subscribe((response: any) => {
  //     if (response && response.token) {
  //       patchState({ token: response.token });
  //     }
  //     return;
  //   });
  // }

  @Action(Logout)
  logout({ patchState }: StateContext<ModelUser>, {}: Logout) {
    patchState({ success: false, token: undefined });

    return;
  }
}
