import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nodata-widget',
  templateUrl: './nodata-widget.component.html',
  styleUrls: ['./nodata-widget.component.scss']
})
export class NodataWidgetComponent implements OnInit {
@Input() info: string;
  constructor() { }

  ngOnInit() {
  }

}
