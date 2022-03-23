import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {
 order : Order;
  constructor() { }

  ngOnInit() {
  }

}
