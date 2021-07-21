import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { LAMPService } from "src/app/_services/lamp.service";
import { NotificationService } from "../../_services/notification.service";

@Component({
  selector: "app-support",
  templateUrl: "./support.component.html",
  styleUrls: ["./support.component.css"],
})
export class SupportComponent implements OnInit {
  IssueList: string[] = ["Login", "Error Message", "Not Loading", "Data incorrect or missing", "Unable to Submit/Save new information", "Problems accessing application or service"];
  myForm = new FormGroup({
    type: new FormControl(null, Validators.required),
    email: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;

  constructor(private notificationService: NotificationService, private lampService: LAMPService) {}

  ngOnInit() {}

  onSubmit() {
    this.lampService.addSupportRequest(this.myForm.value).subscribe((res: any) => {
      if (res && res.success) {
        this.notificationService.success("Thank you for submitting your issue. We will contact your given email address shortly with a response.");
        this.formDirective.resetForm();
      } else {
        this.notificationService.warning("Unable to submit support request, reason: " + res.msg);
      }
    });
  }
}
