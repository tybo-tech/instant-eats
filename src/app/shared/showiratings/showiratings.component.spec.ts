import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowiratingsComponent } from './showiratings.component';

describe('ShowiratingsComponent', () => {
  let component: ShowiratingsComponent;
  let fixture: ComponentFixture<ShowiratingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowiratingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowiratingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
