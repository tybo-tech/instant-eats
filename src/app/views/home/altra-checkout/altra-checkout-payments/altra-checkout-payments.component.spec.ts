import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCheckoutPaymentsComponent } from './altra-checkout-payments.component';

describe('AltraCheckoutPaymentsComponent', () => {
  let component: AltraCheckoutPaymentsComponent;
  let fixture: ComponentFixture<AltraCheckoutPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCheckoutPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCheckoutPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
