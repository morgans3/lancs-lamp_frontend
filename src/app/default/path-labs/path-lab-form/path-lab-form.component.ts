import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { PathLabs } from "../../../_models/lamp";
import { NotificationService } from "../../../_services/notification.service";

@Component({
  selector: "app-path-lab-form",
  templateUrl: "./path-lab-form.component.html",
  styleUrls: ["./path-lab-form.component.scss"],
})
export class PathLabFormComponent implements OnInit, OnChanges {
  @Input() editable?: PathLabs;
  @Input() currentLabs?: PathLabs[];
  usedCodes: any = [];
  editForm: any;
  myForm = new FormGroup({
    lab: new FormControl(null, Validators.required),
    organisation: new FormControl(null, Validators.required),
    npexCode: new FormControl(null, Validators.required),
    namedContact: new FormControl(null, Validators.required),
  });
  @ViewChild(FormGroupDirective, { static: false })
  formDirective: any;
  form: any;
  @Output() eventChange = new EventEmitter<PathLabs>();
  @Output() eventAdded = new EventEmitter<PathLabs>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    if (this.currentLabs && this.currentLabs.length > 0) {
      this.currentLabs.forEach((x: any) => {
        this.usedCodes.push(x.npexCode);
      });
    }
  }

  ngOnChanges() {
    if (this.editable) {
      this.editForm = this.editable;
      this.myForm.patchValue(this.editForm);
    }
  }

  registerNew() {
    if (this.checkNpex(this.myForm.controls["npexCode"].value)) {
      const lab: PathLabs = this.myForm.value;
      lab.createdDT = new Date();
      this.formDirective.resetForm();
      this.eventAdded.emit(lab);
    }
  }

  updateExisting() {
    if ((this.editable && this.editable.npexCode === this.myForm.controls["npexCode"].value) || this.checkNpex(this.myForm.controls["npexCode"].value)) {
      const lab: PathLabs = this.myForm.value;
      lab.createdDT = this.editForm.createdDT;
      this.editForm = null;
      this.formDirective.resetForm();
      this.eventChange.emit(lab);
    }
  }

  checkNpex(code: any) {
    if (this.usedCodes.indexOf(code) > -1) {
      this.notificationService.warning("NPEX Code already in use. Unable to lab information.");
      return false;
    } else {
      return true;
    }
  }

  exitEditMode() {
    this.editForm = null;
    this.formDirective.resetForm();
    this.eventChange.emit(undefined);
  }

  cancel() {
    this.formDirective.resetForm();
    this.eventAdded.emit(undefined);
  }
}
