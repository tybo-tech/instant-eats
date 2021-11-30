import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.scss']
})
export class SliderWidgetComponent implements OnInit {
  @Input() items: SliderHomeWidgetModel[];
  @Input() heading: string;
  @Input() freeImage: string;
  @Input() hideLabel: boolean;
  @Output() itemClickedEvent: EventEmitter<SliderHomeWidgetModel> = new EventEmitter<SliderHomeWidgetModel>();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goto(item: SliderHomeWidgetModel) {
    this.itemClickedEvent.emit(item);
  }

}
