import { Component, Input, OnInit } from '@angular/core';
import { Order, User } from 'src/models';
import { ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss']
})
export class CurrentOrderComponent implements OnInit {
  @Input() order: Order;
  @Input() user: User;
  @Input() progress: string;
  @Input() messegeCount: string;
  arrived: boolean;
  mapId = 'customerMap';
  constructor() { }

  ngOnInit(): void {

  }

  onTravelTimeEvent(time: number) {
    if (Number(time) <= 2) {
      this.arrived = true;
    }
  }
}
