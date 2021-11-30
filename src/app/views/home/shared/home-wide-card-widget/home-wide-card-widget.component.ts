import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-home-wide-card-widget',
  templateUrl: './home-wide-card-widget.component.html',
  styleUrls: ['./home-wide-card-widget.component.scss']
})
export class HomeWideCardWidgetComponent implements OnInit {

  @Input() items: SliderHomeWidgetModel[];
  @Input() showFilter: boolean;
  @Input() primaryAction: string;
  @Output() itemSelectedEvent: EventEmitter<SliderHomeWidgetModel> = new EventEmitter<SliderHomeWidgetModel>();
  @Output() primaryActionEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchString: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goto(id: string, item: SliderHomeWidgetModel = undefined) {
    if (id !== 'event') {
      this.router.navigate([id]);
    }

    if (item && id === 'event') {
      this.itemSelectedEvent.emit(item)
    }
  }

  primaryActionClicked() {
    this.primaryActionEvent.emit(true);
  }

}
