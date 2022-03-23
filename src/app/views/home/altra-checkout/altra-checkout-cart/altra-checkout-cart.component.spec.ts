import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraCheckoutCartComponent } from './altra-checkout-cart.component';

describe('AltraCheckoutCartComponent', () => {
  let component: AltraCheckoutCartComponent;
  let fixture: ComponentFixture<AltraCheckoutCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraCheckoutCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraCheckoutCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
