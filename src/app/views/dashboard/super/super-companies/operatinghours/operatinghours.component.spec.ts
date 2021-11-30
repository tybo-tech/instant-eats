/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OperatinghoursComponent } from './operatinghours.component';

describe('OperatinghoursComponent', () => {
  let component: OperatinghoursComponent;
  let fixture: ComponentFixture<OperatinghoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatinghoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatinghoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
