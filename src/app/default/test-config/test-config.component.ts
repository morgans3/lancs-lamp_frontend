import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatTabGroup } from "@angular/material/tabs";
import { ComponentTypes, Pathway } from "../../_models/pathwayconfig";
import { LAMPService } from "../../_services/lamp.service";
import { NotificationService } from "../../_services/notification.service";

@Component({
  selector: "app-test-config",
  templateUrl: "./test-config.component.html",
  styleUrls: ["./test-config.component.scss"],
})
export class TestConfigComponent implements OnInit {
  formArray: Pathway[] = [];
  formtypes: ComponentTypes[] = [];
  preview: any;
  newForm: any;
  component_types: ComponentTypes[] = [];
  @ViewChild(MatTabGroup, { static: false }) tabGroup: any;

  constructor(private lampService: LAMPService, private formBuilder: FormBuilder, private toastr: NotificationService) {}

  ngOnInit() {
    this.getComponentTypes();
    this.refreshForms();
    this.newForm = this.formBuilder.group({
      test_pathway: null,
      in_use: null,
      owner: null,
      steps: this.formBuilder.array([this.createStep()]),
    });
  }

  getComponentTypes() {
    this.lampService.getComponentTypes().subscribe((data: any) => {
      this.component_types = data.sort((a: any, b: any) => a.type.localeCompare(b.type));
    });
  }

  refreshForms() {
    // this.lampService.getPathways().subscribe((data: Pathway[]) => {
    //   this.formArray = data.sort((a, b) => a.test_pathway.localeCompare(b.test_pathway));
    // });
    this.formArray = [
      {
        test_pathway: "Covid-19 Antigen - LAMP Saliva Test",
        createdDT: new Date(),
        config_id: "string",
        in_use: "true",
        step_count: 2,
        steps: [
          { type: "Patient Verification", order: 0 },
          {
            type: "Contact and Occupation",
            order: 1,
            options: [
              { key: "occupation_required", value: true },
              { key: "occupation_values", value: "https://api.dev.yoursite.com/lists/getOccupations" },
              { key: "censusoccupation_required", value: true },
              { key: "censusoccupation_values", value: "https://api.dev.yoursite.com/lists/getCensusOccupations" },
            ],
          },
        ],
        owner: "stewart.morgan@nhs.net",
      },
    ];
  }

  stepsData(form: any) {
    return form.controls.steps.controls;
  }

  stepsOptionsData(form: any) {
    return form.controls.options.controls;
  }

  createStep(): FormGroup {
    return this.formBuilder.group({
      type: "",
      order: null,
      options: this.formBuilder.array([]),
    });
  }

  createOption(): FormGroup {
    return this.formBuilder.group({
      key: "",
      value: "",
    });
  }

  addSteps(): void {
    const steps = this.newForm.get("steps") as FormArray;
    steps.push(this.createStep());
  }

  removeSteps(index: number): void {
    const steps = this.newForm.get("steps") as FormArray;
    steps.removeAt(index);
  }

  addStepsOption(index: any): void {
    const control = <FormArray>(<FormArray>this.newForm.get("steps")).controls[index].get("options");
    control.push(this.createOption());
  }

  removeStepsOption(index: number, i: number): void {
    const control = <FormArray>(<FormArray>this.newForm.get("steps")).controls[i].get("options");
    control.removeAt(index);
  }

  previewForm(formValue: any) {
    this.preview = formValue;
    this.toastr.info("Preview loaded");
  }

  onSubmit(formValue: any) {
    this.preview = formValue;
    this.lampService.addPathway(this.preview).subscribe((data: any) => {
      if (data.err) {
        this.toastr.warning("Error: " + data.err);
      } else {
        this.resetNewForm();
        this.refreshForms();
        this.toastr.success("This form has been saved and the Mobile Application has been updated.");
      }
    });
  }

  resetNewForm() {
    this.preview = null;
    this.newForm.reset();
    this.newForm = this.formBuilder.group({
      test_pathway: null,
      in_use: null,
      owner: null,
      steps: this.formBuilder.array([this.createStep()]),
    });
  }

  transform(val: any) {
    return JSON.stringify(val, null, 2).split(" ").join("&nbsp;").split("\n").join("<br/>");
  }

  editPathway(pathway: Pathway) {
    console.log(pathway);
    this.tabGroup.selectedIndex = 0;
    this.newForm.patchValue(pathway);
    // patch pathway to form
    // this.editform
  }
}
