import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltraOrderComponent } from './altra-order.component';

describe('AltraOrderComponent', () => {
  let component: AltraOrderComponent;
  let fixture: ComponentFixture<AltraOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltraOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltraOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
