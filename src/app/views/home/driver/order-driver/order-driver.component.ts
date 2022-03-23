import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { Order, User } from 'src/models';
import { AccountService, OrderService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { DRIVER_STATUSES, ORDER_STATUSES, PAY_METHODS } from 'src/shared/constants';

@Component({
  selector: 'app-order-driver',
  templateUrl: './order-driver.component.html',
  styleUrls: ['./order-driver.component.scss']
})
export class OrderDriverComponent implements OnInit, OnDestroy {

  @Input() order: Order;
  @Input() user: User;
  @Input() progress: string;
  @Input() messegeCount: string;
  arrived: boolean;
  destLat
  destLng
  mapId = 'map'
  actionText: string;
  timeInterval: any;
  subscription: any;
  time: number;
  navText: string;
  showCollectCash: boolean;
  constructor(private userService: UserService, private acc: AccountService, private ux: UxService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.calc();
    this.timeInterval = interval(5000);
    this.subscription = this.timeInterval.subscribe(() => {

      if (this.order && this.order.Status) {
        this.calc()
      }
    })

  }
  calc() {
    if (!this.order.CashCollected)
      this.order.CashCollected = 0;

    this.order.CashCollected = Number(this.order.CashCollected);
    const index = ORDER_STATUSES.indexOf(this.order.Status);
    this.actionText = undefined;
    this.navText = undefined;
    if (index <= 3) {
      this.destLat = Number(this.order.Company.Latitude);
      this.destLng = Number(this.order.Company.Longitude);
      this.navText = 'Navigate to resurant'
    } else {
      this.destLat = Number(this.order.Latitude);
      this.destLng = Number(this.order.Longitude);
      this.navText = 'Navigate to customer'
    }
    if (this.order.Status === ORDER_STATUSES[3]) {
      this.actionText = 'Pick up order';
    }


    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.ONLINE.Name) {
      this.actionText = 'Finish delivery';
    }

    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.CASH.Name && this.order.CashCollected) {
      this.actionText = 'Finish delivery';
    }

    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.CASH.Name && !this.order.CashCollected) {
      this.actionText = 'Collect cash';
    }
  }

  onAction() {
    if (!this.order.CashCollected)
      this.order.CashCollected = 0;

    this.order.CashCollected = Number(this.order.CashCollected);
    if (this.order.Status === ORDER_STATUSES[3]) {
      this.order.Status = ORDER_STATUSES[4];
      this.order.PickUpTime = `${new Date()}`;
      this.updateOrder();
      this.ux.showQuickMessage('Delivery picked up.');

      return;
    }


    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.ONLINE.Name) {
      this.order.Status = ORDER_STATUSES[5];
      this.order.DropOffTime = `${new Date()}`;
      this.order.StatusId = 2;
      this.updateOrder();
      this.ux.showQuickMessage('Delivery completed.');

      if (this.user) {
        this.user.UserStatus = DRIVER_STATUSES.BUSY.Name;
        this.userService.updateUserSync(this.user).subscribe(data => {
          if (data)
            this.acc.updateUserState(data);
        })
      }

      return;
    }

    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.CASH.Name && this.order.CashCollected) {
      this.order.Status = ORDER_STATUSES[5];
      this.order.DropOffTime = `${new Date()}`;
      this.order.StatusId = 2;
      this.updateOrder();
      this.ux.showQuickMessage('Delivery completed.');

      
      if (this.user) {
        this.user.UserStatus = DRIVER_STATUSES.BUSY.Name;
        this.userService.updateUserSync(this.user).subscribe(data => {
          if (data)
            this.acc.updateUserState(data);
        })
      }
      return;
    }

    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.CASH.Name && !this.order.CashCollected) {
      this.showCollectCash = true;
      return;
    }
  }

  onCashConfirm() {
    this.order.CashCollected = this.order.Total;
    if (this.order.Status === ORDER_STATUSES[4] && this.order.PaymentMethod === PAY_METHODS.CASH.Name && this.order.CashCollected) {
      this.order.Status = ORDER_STATUSES[5];
      this.order.StatusId = 2;
      this.order.DropOffTime = `${new Date()}`;
      this.updateOrder();
      this.showCollectCash = false;
      this.ux.showQuickMessage('Delivery completed.');

      return;
    }
  }
  onTravelTimeEvent(time: number) {
    this.time = time;
    if (Number(time) <= 2) {
      this.arrived = true;
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onUserEvent(user: User) {
    if (user)
      this.userService.updateUserSync(user).subscribe(data => {
        if (data && data.UserId)
          this.acc.updateUserState(data);
      })
  }

  updateOrder() {
    this.orderService.update(this.order).subscribe(data => {
      if (data) {
        this.order = data;
        this.orderService.updateOrderState(this.order);
        this.userService.getUserSync(this.user.UserId).subscribe(_user => {
          if (_user && _user.UserId) {
            this.acc.updateUserState(_user);
          }
        })
      }
    })
  }
}
