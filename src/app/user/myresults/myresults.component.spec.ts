/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MyresultsComponent } from './myresults.component';

describe('MyresultsComponent', () => {
  let component: MyresultsComponent;
  let fixture: ComponentFixture<MyresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
