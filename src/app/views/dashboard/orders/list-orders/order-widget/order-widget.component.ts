import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BASE, environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Delivery } from 'src/models/delivery.model';
import { SHIPPING_OPTIONS } from 'src/models/shipping.model';
import { EmailService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { DeliveryService } from 'src/services/delivery.service';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ACTIVEORDERS, DELIVERY_REQUEST_STATUSES, DRIVER, DRIVER_STATUSES, HISTORYORDERS, NOTIFY_EMAILS, ORDER_STATUSES, PENDINGORDERS } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-order-widget',
  templateUrl: './order-widget.component.html',
  styleUrls: ['./order-widget.component.scss']
})
export class OrderWidgetComponent implements OnInit {
  @Input() orders: Order[];
  @Input() user: User;
  @Output() orderClicked: EventEmitter<Order> = new EventEmitter<Order>();
  driverId: string;
  PENDINGORDERS = PENDINGORDERS
  order: Order;
  showAddCancel: boolean;
  showAdd: boolean;
  config: WebConfig = getConfig(BASE);
  formError;
  showAssignDrivers: boolean;
  loading: boolean;
  users: User[];
  selectedOrder: Order;
  drivers: User[];
  noDriver = 'No driver assigned';
  ORDER_STATUSES = ORDER_STATUSES;
  cancelReason: string = '';
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private uxService: UxService,
    private companyService: CompanyService,
    private deliveryService: DeliveryService,
    private emailService: EmailService,
    private router: Router,
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.getUsers()
  }
  select(order: Order) {
    this.orderClicked.emit(order);
  }

  calTime() {
    if (this.order) {
      this.order = this.orderService.estimateDelivery(this.order, this.order.DeliveryMins);
    }

  }
  cancel(order: Order) {

    order.Status = ORDER_STATUSES[6];
    order.StatusId =0;
    order.FulfillmentStatus = this.cancelReason;
    this.order =order
    this.updateOrder()
  }
  orderAction(action: string, order: Order) {
    this.order = order

    if (action === 'Cancel') {
      this.showAddCancel = true;
    }

    if (action === ORDER_STATUSES[2]) {
      this.showAdd = true;
      this.order.Status = ORDER_STATUSES[2];
      this.order.StatusId = ACTIVEORDERS;
      this.order.DeliveryMins = Number(this.order.Company.DeliveryTime || '15');
      if (this.order.DeliveryMins)
        this.calTime();

      this.order.StatusId = ACTIVEORDERS;

      // this.updateOrder();
    }
    if (action === ORDER_STATUSES[3]) {
      this.order.Status = ORDER_STATUSES[3];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[3]) {
      this.order.Status = ORDER_STATUSES[3];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[4]) {
      this.order.Status = ORDER_STATUSES[4];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[5]) {
      this.order.Status = ORDER_STATUSES[5];
      this.order.StatusId = HISTORYORDERS;
      this.updateOrder();
    }
  }

  getUsersNearByDrivers() {
    this.companyService.getUsersNearBy(this.order.Company.Latitude, this.order.Company.Longitude, Number(this.order.Company.Radius || 10), DRIVER, this.order.OrdersId).subscribe(data => {
      console.log(data);
      if (data) {
        this.drivers = data;
        this.orderService.assignDrivers(this.drivers, this.order);
      }

    })
  }
  updateOrder() {
    this.showAdd = false;
    this.showAddCancel = false;

    if (this.order.Status === ORDER_STATUSES[2]) {
      this.order.AccetpTime = `${new Date()}`;
      if (this.order.DriverId) {
        if (!this.users)
          return;

        const driver = this.users.find(x => x.UserId === this.driverId);
        if (driver)
          this.notifyDriver(driver, this.order)
      }
    }


    if (this.order.Status === ORDER_STATUSES[3]) {
      this.order.FinishTime = `${new Date()}`;
    }

    if (this.order.Status === ORDER_STATUSES[4]) {
      this.order.PickUpTime = `${new Date()}`;
    }


    if (this.order.Status === ORDER_STATUSES[5]) {
      this.order.DropOffTime = `${new Date()}`;
    }
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.notify();

      }
    });
  }
  notify() {
    if (this.order.Status === ORDER_STATUSES[2]) {
      if (this.order.Customer.AddressUrlWork)
        this.pushNotify(this.order.Customer.AddressUrlWork, ` Order accepted`, `Congratulations, your order has been accepted by ${this.order.Company.Name}`,
          `${environment.BASE_URL}/home/view-my-order/${this.order.OrdersId}`, this.orderService.getOneProductOrderImage(this.order));

      const body = `Congratulations, your order has been accepted by ${this.order.Company.Name} and it is in progress.
    The estimated shipping date is : ${this.order.EstimatedDeliveryDate}.
    We will send you the email as soon the seller confirms the shipment.
    
    `;
      this.sendEmailLogToShop(body, this.order.CustomerName, this.order.CustomerEmail);
      this.sendEmailLogToShop(body, this.order.CustomerName, NOTIFY_EMAILS);
      this.sendEmailRange(this.order.Company.Name, this.order.Company.AddressLine);
      this.getUsersNearByDrivers();
    }


    if (this.order.Status === ORDER_STATUSES[3]) {
      if (this.order.Customer.AddressUrlWork)
        this.pushNotify(this.order.Customer.AddressUrlWork, `Food is ready to be picked`, `The ${this.config.WebCatergoryNameSingular} just finished`,
          `${environment.BASE_URL}/home/view-my-order/${this.order.OrdersId}`, this.orderService.getOneProductOrderImage(this.order));
    }

    if (this.order.Status === ORDER_STATUSES[4] && this.order.Shipping === SHIPPING_OPTIONS[1].Name) {
      if (this.order.Customer.AddressUrlWork)
        this.pushNotify(this.order.Customer.AddressUrlWork, `On the way`, `The driver is heading your way`,
          `${environment.BASE_URL}/home/view-my-order/${this.order.OrdersId}`, this.orderService.getOneProductOrderImage(this.order));
    }

    if (this.order.Status === ORDER_STATUSES[5] && this.order.Shipping === SHIPPING_OPTIONS[1].Name) {
      if (this.order.Customer.AddressUrlWork)
        this.pushNotify(this.order.Customer.AddressUrlWork, `Your food arrived`, `The driver is here, Enjoy!`,
          `${environment.BASE_URL}/home/view-my-order/${this.order.OrdersId}`, this.orderService.getOneProductOrderImage(this.order));
    }

    if (this.order.Status === ORDER_STATUSES[6]) {
      if (this.order.Customer.AddressUrlWork)
        this.pushNotify(this.order.Customer.AddressUrlWork, ` Order cancelled`, `Sorry, your order has been cancelled by ${this.order.Company.Name}
        <br>
        Reason: ${this.order.FulfillmentStatus}
        `, 
      
          `${environment.BASE_URL}/home/view-my-order/${this.order.OrdersId}`, this.orderService.getOneProductOrderImage(this.order));

      const body = `Sorry, your order has been cancelled by ${this.order.Company.Name}
      <br>
      Reason: ${this.order.FulfillmentStatus}
    
    `;
      this.sendEmailLogToShop(body, this.order.CustomerName, this.order.CustomerEmail, 'Order cancelled');
      this.sendEmailLogToShop(body, this.order.CustomerName, NOTIFY_EMAILS,'Order cancelled');
      this.sendEmailRange(this.order.Company.Name, this.order.Company.AddressLine);
      this.getUsersNearByDrivers();
    }
  }


  assignDriver(order: Order) {
    this.showAssignDrivers = true;
    this.selectedOrder = order;
    this.getUsers();
  }
  view(order: Order) {
    this.router.navigate(['admin/dashboard/order', order.OrdersId]);
  }
  getUsers() {
    this.loading = true;
    this.userService.getAllUsersStync(DRIVER).subscribe(data => {
      this.users = [];
      this.loading = false;
      if (data && data.length) {
        this.users = data;
      }
    })
  }
  driverSelected() {
    if (!this.users)
      return;

    const driver = this.users.find(x => x.UserId === this.driverId);
    if (driver) {
      this.order.DriverId = driver.UserId;
      this.order.DriverName = driver.Name;
      this.order.DriverRequestLastModified = `${new Date()}`;
      this.order.DriverStatus = DELIVERY_REQUEST_STATUSES.ACCEPTED.Name;

      driver.DriverStatus = this.order.DriverStatus;
      driver.UserStatus = DRIVER_STATUSES.BUSY.Name;
      this.userService.updateUserSync(driver).subscribe(data => {
        if (data) {
          console.log(this.order);

        }

      })

    }

  }
  saveAssignDriver(user: User) {
    this.selectedOrder.DriverId = user.UserId;
    this.selectedOrder.DriverName = user.Name;
    this.orderService.update(this.selectedOrder).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.showQuickMessage(`Driver Assigned.`);
        this.showAssignDrivers = false;
      }
    });
  }
  notifyDriver(driver: User, order: Order) {
    const driverData: Email = {
      Email: `${driver.Email}, ${NOTIFY_EMAILS}`,
      Subject: 'New delivery assigned to you.',
      Message: `
    Hi ${driver.Name}, <br>
    You have new delivery assigned to you.
<br>
<h6 class="name">
<b> Order #${order.Id} , </b> for <b>${order.CustomerName} </b>
<br>
<small>
    ${order.FullAddress}
</small>
</h6>

    `,
      Link: `${environment.BASE_URL}/home/sign-in`,
      LinkLabel: 'View details'
    }
    this.emailService.sendGeneralTextEmail(driverData)
      .subscribe(response => {
        if (response > 0) {
          console.log('Mail sent');

        }
      });
  }
  sendEmailRange(companyName: string, companyAddress: string) {
    if (this.drivers && this.drivers.length) {
      const emails: Email[] = [];
      this.drivers.forEach(driver => {
        const driverData: Email = {
          Email: `${driver.Email}, ${NOTIFY_EMAILS}`,
          Subject: 'New delivery  request.',
          Message: `New order was accepted by ${companyName}, ${companyAddress}`,
          UserFullName: companyName,
          Link: `${environment.BASE_URL}/home/sign-in`,
          LinkLabel: 'Accept or reject order'
        }
        emails.push(driverData);
      });

      this.emailService.sendGeneralRangeTextEmail(emails)
        .subscribe(response => {
          this.createdDelivery();

          if (response > 0) {

          }
        });
    } else {
      this.createdDelivery();

    }


  }
  sendEmailLogToShop(data, companyName: string, email: string, sub: string =  'New order accepted & in  progress.') {
    const emailToSend: Email = {
      Email: email,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/private/order-details/${this.order.OrdersId}`,
      LinkLabel: 'View Order'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
  createdDelivery() {

    const delivery: Delivery = {
      DeliveryId: '',
      CompanyId: this.order.CompanyId,
      CustomerId: this.order.CustomerId,
      OrderId: this.order.OrdersId,
      LatitudeFrom: this.order.Company.Latitude || 0,
      LongitudeFrom: this.order.Company.Longitude || 0,
      LatitudeTo: this.order.Customer.Latitude || 0,
      LongitudeTo: this.order.Customer.Longitude || 0,
      DirectionFrom: this.order.Company.AddressLine,
      DirectionTo: this.order.FullAddress,
      FromName: this.order.Company.Name,
      ToName: this.order.CustomerName,
      FromAddress: this.order.Company.AddressLine,
      ToAddress: this.order.FullAddress,
      Sammary: 'Food order',
      TotalTime: '20',
      TotalCharge: '20',
      TotalDistance: '',
      DriverId: 'none',
      DriverName: '',
      DriverDp: '',
      DriverReg: '',
      DriverGender: '',
      DriverFee: '',
      DeliverStatus: 'Pending',
      Notes: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
    this.deliveryService.add(delivery).subscribe(data => {

    })
  }

  pushNotify(sub, title: string, body: string, url: string, image: string = '') {
    this.userService.notify({
      subscribtion: JSON.parse(sub), payload: {
        title: title,
        body: body,
        label1: '',
        label2: '',
        image: image,
        icon: `https://instanteats.co.za/api//api/upload/uploads/1646145462iio.jpg`,
        url1: url,
        url2: ''
      }
    }).subscribe(e => {
      console.log(e);


    });
  }
}
