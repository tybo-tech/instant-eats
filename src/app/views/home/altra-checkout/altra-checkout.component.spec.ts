import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCheckoutComponent } from './altra-checkout.component';

describe('AltraCheckoutComponent', () => {
  let component: AltraCheckoutComponent;
  let fixture: ComponentFixture<AltraCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
