import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order, User } from 'src/models';
import { OrderService, UserService } from 'src/services';
import { ACCEPT_REQUEST_SECONDS, DELIVERY_REQUEST_STATUSES, DRIVER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {
  @Input() order: Order;
  @Input() user: User;
  @Output() requestEvent: EventEmitter<Order> = new EventEmitter<Order>();
  DELIVERY_REQUEST_STATUSES = DELIVERY_REQUEST_STATUSES;
  constructor(private orderService: OrderService, private userService: UserService) { }
  MAX_WAIT = ACCEPT_REQUEST_SECONDS;
  ngOnInit(): void {
    // alert(2)
 
  }
  accept() {
    this.order.DriverId = this.user.UserId;
    this.order.DriverName = this.user.Name;
    this.order.DriverRequestLastModified = `${new Date()}`;
    this.order.DriverStatus = this.DELIVERY_REQUEST_STATUSES.ACCEPTED.Name;
    if (this.user) {
      this.user.UserStatus = DRIVER_STATUSES.BUSY.Name;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data)
          this.update();

      })
    }
  }
  decline() {
    this.order.DriverStatus = this.DELIVERY_REQUEST_STATUSES.DECLINED.Name;
    this.order.DriverRequestLastModified = `${new Date()}`;
    this.update();
  }

  update() {
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.requestEvent.emit(data);
      }
    })
  }
}
