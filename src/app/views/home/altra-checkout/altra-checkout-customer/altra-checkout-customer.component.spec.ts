import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCheckoutCustomerComponent } from './altra-checkout-customer.component';

describe('AltraCheckoutCustomerComponent', () => {
  let component: AltraCheckoutCustomerComponent;
  let fixture: ComponentFixture<AltraCheckoutCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCheckoutCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCheckoutCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
