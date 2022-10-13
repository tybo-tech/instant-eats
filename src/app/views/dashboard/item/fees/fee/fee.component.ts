import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeesModel } from 'src/models/item.model';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {
  @Input() fee: FeesModel;
  @Output() feeEvent: EventEmitter<FeesModel> = new EventEmitter<FeesModel>();

  // <app fee [fee]="fee" (feeEvent)="onFeeEvent($event)">
  constructor() { }

  ngOnInit(): void {
  }

  change() {
    this.feeEvent.emit(this.fee);
  }

}
