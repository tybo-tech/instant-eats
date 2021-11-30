import { Component, Input, OnInit } from '@angular/core';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-slider-widget',
  templateUrl: './slider-widget.component.html',
  styleUrls: ['./slider-widget.component.scss']
})
export class SliderWidgetComponent implements OnInit {
  @Input() items: SliderHomeWidgetModel[];
  constructor() { }

  ngOnInit() {
  }

}
