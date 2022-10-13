import { Component, Input, OnInit } from '@angular/core';
import { BASE } from 'src/environments/environment';
import { Order, User } from 'src/models';
import { ORDER_STATUSES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

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
  config: WebConfig;
  constructor() { }

  ngOnInit(): void {
    this.config = getConfig(BASE);
  }

  onTravelTimeEvent(time: number) {
    if (Number(time) <= 2) {
      this.arrived = true;
    }
  }
}
