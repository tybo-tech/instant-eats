import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDriverComponent } from './order-driver.component';

describe('OrderDriverComponent', () => {
  let component: OrderDriverComponent;
  let fixture: ComponentFixture<OrderDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
