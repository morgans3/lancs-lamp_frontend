import { Action, Selector, State, StateContext } from "@ngxs/store";
import { map } from "rxjs/operators";
import { Organisation } from "../_models/ModelOrganisation";

export class ReferenceStateModel {
  organisations: Organisation[] = [];
}

export class UpdateOrganisations {
  static readonly type = "[Organisation] UpdateOrganisations";
  constructor(public payload: Organisation[]) {}
}

@State<ReferenceStateModel>({
  name: "statereference",
})
export class ReferenceState {
  @Selector()
  static getOrganisations(state: ReferenceStateModel) {
    return state.organisations;
  }

  constructor() {}

  @Action(UpdateOrganisations)
  updateOrganisations({ patchState, getState }: StateContext<ReferenceStateModel>, { payload }: UpdateOrganisations) {
    if (payload) {
      const sorted = payload.sort((a: any, b: any) => {
        const nameA = a.name.toString().toLowerCase(),
          nameB = b.name.toString().toLowerCase();
        if (nameA > nameB) {
          return 1;
        }
        if (nameA < nameB) {
          return -1;
        }
        return 0;
      });
      patchState({ organisations: sorted });
      return;
    }
  }
}
