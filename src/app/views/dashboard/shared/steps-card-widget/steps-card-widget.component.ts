import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-steps-card-widget',
  templateUrl: './steps-card-widget.component.html',
  styleUrls: ['./steps-card-widget.component.scss']
})
export class StepsCardWidgetComponent implements OnInit {

  @Input() item: SliderHomeWidgetModel;
  @Input() showFilter: boolean;
  @Input() canEdit: boolean;
  @Input() primaryAction: string;
  @Output() itemSelectedEvent: EventEmitter<SliderHomeWidgetModel> = new EventEmitter<SliderHomeWidgetModel>();
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

}
