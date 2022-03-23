import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { ItemService } from 'src/services/item.service';
import { SchedulerService } from 'src/services/scheduler.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, DELIVERY_REQUEST_STATUSES, DRIVER, DRIVER_STATUSES, ITEM_TYPES, NOTIFY_EMAILS, ORDER_DRIVER_STATUSES, ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  timeInterval: any;
  subscription: any;
  user: User;
  driverOrder: Order;

  requestInterval: any;
  requestSubscription: any;
  countDownInterval: any;
  countDownSubscription: any;
  constructor(
    private orderService: OrderService,
    private schedulerService: SchedulerService,
    private itemService: ItemService,
    private uxService: UxService,
    private accountService: AccountService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => this.user = data);
    // this.assignDriversToOrdersStep_One();
    this.getOrdersToAssign()
    this.requestInterval = interval(4000);
    this.requestSubscription = this.requestInterval.subscribe(() => {
      // this.assignDriversToOrdersStep_One();
      this.getOrdersToAssign()
    })
    this.countDownInterval = interval(1000);
    this.countDownSubscription = this.countDownInterval.subscribe(() => {
      if (this.driverOrder) {
        // this.driverOrder.DriverCount = this.itemService.getSeconds(this.driverOrder.DriverRequestLastModified);
      }
    })

  }

  getOrdersToAssign() {
    return;
    if (!this.user || this.user.UserType !== ADMIN)
      return;

    this.orderService.getOrdersNearByUserByStatus(this.user.Latitude, this.user.Longitude, ORDER_STATUSES[2], 100, this.user.UserId).subscribe(orders => {
      // if (orders && orders.length)
      //   this.schedulerService.queDrivers(orders);
    })
  }
  assignDriversToOrdersStep_One() {
    if (!this.user || this.user.UserType !== DRIVER || this.user.UserStatus !== DRIVER_STATUSES.ONLINE.Name)
      return;

    // Dont get orders if you currentyly havibg a request 
    if (this.driverOrder) {
      if (this.driverOrder.DriverCount < 45 && this.driverOrder.DriverRequestId === this.user.UserId)
        return;
    }
    // Create timeout for this driver
    if (this.driverOrder && this.driverOrder.Driver && this.driverOrder.DriverCount > 45) {
      this.orderService.createRequestTimeOut(this.driverOrder.Driver, this.driverOrder).subscribe(data => {
        if (data && data.ItemId) {
          this.userService.getUserSync(this.driverOrder.Driver.UserId).subscribe(_user => {
            if (_user && _user.UserType) {
              _user.LastDeliveryTime = `${new Date()}`;
              this.userService.updateUserSync(_user).subscribe(_updated => {
                if (_updated)
                  this.assignDriversToOrdersStep_Two();
              })
            }
          })
        }
      })
    } else {
      this.assignDriversToOrdersStep_Two();
    }
  }

  assignDriversToOrdersStep_Two() {
    this.orderService.getOrdersNearByUserByStatus(this.user.Latitude, this.user.Longitude, ORDER_STATUSES[2], 100, this.user.UserId).subscribe(orders => {
      if (orders && orders.length) {
        this.driverOrder = null;
        orders.map(x => x.DriverCount = this.itemService.getSeconds(x.DriverRequestLastModified || `${new Date()}`))

        orders.forEach(item => {
          if (item.DriverRequestLastModified && item.DriverStatus !== DELIVERY_REQUEST_STATUSES.ACCEPTED.Name) {
            if (item.DriverCount > 46) {
              item.DriverRequestLastModified = '';
              item.DriverStatus = '';
              item.DriverRequestId = '';
              item.DriverCount = 1;
            }
          }
        })
        const order = orders.find(x => !x.DriverRequestId);
        // debugger
        // const order = orders[0];


        let driver;
        if (order)
          driver = this.getDriver(order);

        // Assign
        if (order && driver) {
          this.driverOrder = order;
          this.driverOrder.Driver = driver;
          this.driverOrder.DriverStatus = DELIVERY_REQUEST_STATUSES.REQUESTED.Name;
          this.driverOrder.DriverRequestLastModified = `${new Date()}`;
          this.driverOrder.DriverRequestId = driver.UserId;
          this.updateOrder(this.driverOrder)
          if (driver.UserId === this.user.UserId)
            this.uxService.beep();

          // driver.UserStatus = DRIVER_STATUSES.PENDING.Name;
          this.updateUser(this.driverOrder.Driver);

          // Notify
          if (driver.AddressUrlWork && driver.AddressUrlWork.includes("endpoint")) {
            this.orderService.pushNotify(driver.AddressUrlWork, `New delivery request`, `From ${order.Company.Name} to ${order.FullAddress}`,
              `${environment.BASE_URL}/driver/dashboard/${order.OrdersId}`, this.orderService.getOneProductOrderImage(order));
          }

          // Email
          const emailToSend: Email = {
            Email: `${driver.Email}, ${NOTIFY_EMAILS}`,
            Subject: `New delivery request`,
            Message: `From ${order.Company.Name} to ${order.FullAddress}`
          };

          this.orderService.sendGeneralTextEmail(emailToSend);

        } else {
          if (!order) {
            this.driverOrder = orders.find(x => x.DriverRequestId === this.user.UserId);
            if (this.driverOrder)
              this.driverOrder.Driver = this.user;
          }
        }

      }
    })
  }
  updateUser(driver: User) {
    this.userService.updateUserSync(driver).subscribe(data => {
      if (data && data.UserId && data.UserId === this.user.UserId) {
        this.accountService.updateUserState(data);
      }
    })
  }

  getDriver(order: Order) {

    if (!order)
      return null;

    if (!order.Drivers || !order.Drivers.length)
      return this.user;

    let drivers = order.Drivers;
    const timeouts = order.Items && order.Items.filter(x => x.ItemType === ITEM_TYPES.REQUEST.Name && x.ItemStatus === DELIVERY_REQUEST_STATUSES.TIMEDEDOUT.Name);
    const declines = order.Items && order.Items.filter(x => x.ItemType === ITEM_TYPES.REQUEST.Name && x.ItemStatus === DELIVERY_REQUEST_STATUSES.DECLINED.Name);
    drivers.forEach(d => {
      d.Timeouts = timeouts.filter(x => x.RelatedId === d.UserId);
      d.Declines = declines.filter(x => x.RelatedId === d.UserId);
      d.LastDeliveryCount = this.itemService.getSeconds(d.LastDeliveryTime || `${new Date()}`);
      console.log(d.Name, d.Timeouts, d.Declines, d.LastDeliveryCount);
    });
    drivers = drivers.filter(x => !x.Declines.length)
    //Return the user with minimum timeouts
    const minTimeouts = this.getDriverWithMinimunTimeouts(drivers);
    const oldestTime = this.getDriversWithOldestRequestTime(drivers);
    console.log(oldestTime);

    if (oldestTime)
      return oldestTime;

    if (minTimeouts)
      return minTimeouts;


    // If all drivers havnt done a trips, take this user.
    const numberOfTrips = drivers.filter(x => !x.LastDeliveryTime);
    if (numberOfTrips.length === drivers.length)
      return this.user;
  }

  getDriverWithMinimunTimeouts(users: User[] = []) {
    if (!users.length)
      return null;
    let user = users[0];
    users.forEach(x => {
      if (x.Timeouts.length < user.Timeouts.length)
        user = x;

    })
    return user;
  }
  getDriversWithOldestRequestTime(users: User[] = []) {
    if (!users.length)
      return null;
    let user = users[0];
    users.forEach(x => {
      if (x.LastDeliveryCount > user.LastDeliveryCount)
        user = x;

    })
    return user;
  }

  updateOrder(order: Order) {
    this.orderService.update(order).subscribe(data => { })
  }




  getRequest() {
    this.orderService.select(
      `
      SELECT * FROM item WHERE
      ItemCategory = '${ITEM_TYPES.REQUEST.Name}'
      AND ItemStatus = '${DELIVERY_REQUEST_STATUSES.REQUESTED.Name}'
      ORDER BY CreateDate DESC
      `)
      .subscribe(data => {
        if (data && data.length) {
          const requestedItems: Item[] = data;
          this.itemService.updateTimeOuts(requestedItems);
        }
      })
  }

  onRequestEvent(order: Order) {
    if (!order)
      return;

    this.driverOrder = null;

    this.updateUser(this.user);
  }


}
