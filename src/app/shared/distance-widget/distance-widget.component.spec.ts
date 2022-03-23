import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceWidgetComponent } from './distance-widget.component';

describe('DistanceWidgetComponent', () => {
  let component: DistanceWidgetComponent;
  let fixture: ComponentFixture<DistanceWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistanceWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
