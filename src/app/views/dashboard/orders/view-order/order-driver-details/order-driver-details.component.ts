import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, User } from 'src/models';
import { ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-order-driver-details',
  templateUrl: './order-driver-details.component.html',
  styleUrls: ['./order-driver-details.component.scss']
})
export class OrderDriverDetailsComponent implements OnInit {
  @Input() order: Order;
  @Input() user: User;
  @Input() messegeCount: number;
  ORDER_STATUSES = ORDER_STATUSES;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  send() {
    this.router.navigate([`/home/chat/${this.order.OrdersId}`]);
  }
  rate() {
    this.router.navigate([`/home/rate/${this.order.OrdersId}`]);
  }
}
