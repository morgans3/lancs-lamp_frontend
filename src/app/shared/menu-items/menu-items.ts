import { Injectable } from "@angular/core";

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: "pathways", name: "Test Pathways", type: "link", icon: "create" },
  { state: "registration", name: "Registration", type: "link", icon: "account_circle" },
  { state: "my_results", name: "Results", type: "link", icon: "folder_shared" },
  { state: "dashboard", name: "Dashboard", type: "link", icon: "add_to_queue" },
  { state: "receipting", name: "Lab Receipting", type: "link", icon: "assignment_returned" },
  { state: "resulting", name: "Lab Resulting", type: "link", icon: "assignment_turned_in" },
  {
    state: "administration",
    name: "Administration",
    type: "sub",
    icon: "verified_user",
    children: [
      {
        state: "testcentres",
        name: "Test Centres",
        type: "link",
        icon: "fas fa-universal-access",
        security: true,
      },
      {
        state: "pathlabs",
        name: "Pathology Labs",
        type: "link",
        icon: "fas fa-bacteria",
        security: true,
      },
      {
        state: "results",
        name: "Results",
        type: "link",
        icon: "fas fa-vials",
        security: true,
      },
      {
        state: "admin",
        name: "Admin",
        type: "link",
        icon: "security",
        security: true,
      },
      {
        state: "testconfiguration",
        name: "Test Configuration",
        type: "link",
        icon: "settings",
        security: true,
      },
    ],
  },
  { state: "problems", name: "Support", type: "link", icon: "announcement" },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
