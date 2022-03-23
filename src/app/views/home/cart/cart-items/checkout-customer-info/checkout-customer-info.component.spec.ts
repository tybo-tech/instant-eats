import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutCustomerInfoComponent } from './checkout-customer-info.component';

describe('CheckoutCustomerInfoComponent', () => {
  let component: CheckoutCustomerInfoComponent;
  let fixture: ComponentFixture<CheckoutCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
