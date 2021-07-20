import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { Address, PathLabs, TestCentre } from "../../../_models/lamp";

@Component({
  selector: "app-test-centre-form",
  templateUrl: "./test-centre-form.component.html",
  styleUrls: ["./test-centre-form.component.scss"],
})
export class TestCentreFormComponent implements OnInit, OnChanges {
  @Input() editable?: TestCentre;
  @Input() pathLabs?: PathLabs[];
  usedCodes = [];
  editForm: any;
  myForm = new FormGroup({
    testcentre: new FormControl(null, Validators.required),
    owner: new FormControl(null, Validators.required),
    opening: new FormControl(null, Validators.required),
    closing: new FormControl(null),
    node: new FormControl(null, Validators.required),
    pathlab: new FormControl(null),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  form: any;
  @Output() eventChange = new EventEmitter<TestCentre>();
  @Output() eventAdded = new EventEmitter<TestCentre>();
  pathlabs: PathLabs[] = [];
  read_loc: any;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.pathLabs && this.pathlabs !== this.pathLabs) {
      this.pathlabs = this.pathLabs;
    }
    if (this.editable) {
      this.editForm = this.editable;
      this.myForm.patchValue(this.editForm);
      if (this.editForm.node) {
        this.read_loc = this.editForm.location;
      }
    }
  }

  registerNew() {
    const lab: TestCentre = this.myForm.value;
    lab.createdDT = new Date();
    if (this.read_loc) {
      lab.location = this.read_loc;
    }
    this.formDirective.resetForm();
    this.eventAdded.emit(lab);
  }

  updateExisting() {
    const lab: TestCentre = this.myForm.value;
    lab.createdDT = this.editForm.createdDT;
    if (this.read_loc) {
      lab.location = this.read_loc;
    }
    this.editForm = null;
    this.formDirective.resetForm();
    this.eventChange.emit(lab);
  }

  exitEditMode() {
    this.editForm = null;
    this.read_loc = null;
    this.formDirective.resetForm();
    this.eventChange.emit(undefined);
  }

  cancel() {
    this.read_loc = null;
    this.formDirective.resetForm();
    this.eventAdded.emit(undefined);
  }

  updateLocation(newlocation: Address) {
    this.read_loc = newlocation;
    if (newlocation) {
      this.myForm.controls["node"].patchValue(newlocation.postcode);
    } else {
      this.myForm.controls["node"].patchValue(null);
    }
  }
}
