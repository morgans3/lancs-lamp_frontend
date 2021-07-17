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
  { state: "results", name: "Results", type: "link", icon: "folder_shared" },
  { state: "dashboard", name: "Dashboard", type: "link", icon: "add_to_queue" },
  { state: "receipting", name: "Lab Receipting", type: "link", icon: "assignment_returned" },
  { state: "resulting", name: "Lab Resulting", type: "link", icon: "assignment_turned_in" },
  { state: "administration", name: "Administration", type: "link", icon: "verified_user" },
  { state: "problems", name: "Support", type: "link", icon: "announcement" },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
