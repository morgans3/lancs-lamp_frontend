/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PathwaysComponent } from './pathways.component';

describe('PathwaysComponent', () => {
  let component: PathwaysComponent;
  let fixture: ComponentFixture<PathwaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
