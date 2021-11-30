import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { BreadModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-dash-tabs-widget',
  templateUrl: './dash-tabs-widget.component.html',
  styleUrls: ['./dash-tabs-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class DashTabsWidgetComponent implements OnInit {
  @Input() items: BreadModel[];
  @Output() tabClickedEvent: EventEmitter<BreadModel> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  tab(item: BreadModel) {
    if (item.Id === 'back-btn') {
      this.tabClickedEvent.emit(item);
      return
    }
    this.items.map(x => x.Class = []);
    item.Class = ['active'];
    if (this.items.find(x => x.Id === 'back-btn')) {
      this.items.find(x => x.Id === 'back-btn').Class = ['back-btn'];
    }
    this.tabClickedEvent.emit(item);

  }
}
