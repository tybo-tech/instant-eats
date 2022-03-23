import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDriverDetailsComponent } from './order-driver-details.component';

describe('OrderDriverDetailsComponent', () => {
  let component: OrderDriverDetailsComponent;
  let fixture: ComponentFixture<OrderDriverDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDriverDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDriverDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
