import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutTipComponent } from './checkout-tip.component';

describe('CheckoutTipComponent', () => {
  let component: CheckoutTipComponent;
  let fixture: ComponentFixture<CheckoutTipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutTipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
