import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Delivery } from 'src/models/delivery.model';
import { EmailService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { DeliveryService } from 'src/services/delivery.service';
import { UxService } from 'src/services/ux.service';
import { ACTIVEORDERS, DRIVER, HISTORYORDERS, NOTIFY_EMAILS, ORDER_STATUSES, PENDINGORDERS } from 'src/shared/constants';

@Component({
  selector: 'app-order-widget',
  templateUrl: './order-widget.component.html',
  styleUrls: ['./order-widget.component.scss']
})
export class OrderWidgetComponent implements OnInit {
  @Input() orders: Order[];
  @Input() user: User;
  @Output() orderClicked: EventEmitter<Order> = new EventEmitter<Order>();
  PENDINGORDERS = PENDINGORDERS
  order: Order;
  showAddCancel: boolean;
  showAdd: boolean;
  formError;
  showAssignDrivers: boolean;
  loading: boolean;
  users: User[];
  selectedOrder: Order;
  drivers: User[];
  ORDER_STATUSES = ORDER_STATUSES;
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private uxService: UxService,
    private companyService: CompanyService,
    private deliveryService: DeliveryService,
    private emailService: EmailService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
  select(order: Order) {
    this.orderClicked.emit(order);
  }
  accept(order: Order) {

  }
  calTime() {
    if (this.order) {
      const date = new Date();
      this.order.EstimatedDeliveryDate = `${new Date(date.getTime() + Number(this.order.DeliveryMins) * 60000)}`;
    }

  }

  orderAction(action: string, order: Order) {
    this.order = order

    if (action === 'Cancel') {
      this.showAddCancel = true;
    }
    if (action === 'Accept') {
      this.showAdd = true;
      this.order.Status = ORDER_STATUSES[1];
      this.order.StatusId = ACTIVEORDERS;

      this.companyService.getUsersNearBy(order.Company.Latitude, order.Company.Longitude, Number(order.Company.Radius || 10), DRIVER).subscribe(data => {
        console.log(data);
        if (data) {
          this.drivers = data;
        }

      })

    }
    if (action === ORDER_STATUSES[2]) {
      this.order.Status = ORDER_STATUSES[2];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
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
  updateOrder() {
    this.showAdd = false;
    this.showAddCancel = false;
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {

        if(this.order.Status === ORDER_STATUSES[1]){
          
        const body = `Congratulations, your order has been accepted by the seller and it is in progress.
        The estimated shipping date is : ${this.order.EstimatedDeliveryDate}.
        We will send you the email as soon the seller confirms the shipment.
        
        `;
        this.sendEmailLogToShop(body, this.order.Customer.Name, this.order.Customer.Email);
        this.sendEmailLogToShop(body, this.order.Customer.Name, NOTIFY_EMAILS);
        this.sendEmailRange(this.order.Company.Name, this.order.Company.AddressLine);
        }

      }
    });
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
      this.showAssignDrivers = true;
      this.loading = false;
      if (data && data.length) {
        this.users = data;
      }
    })
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
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'New order accepted & in  progress.',
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
      DirectionTo: this.order.Customer.AddressLineHome,
      FromName: this.order.Company.Name,
      ToName: this.order.Customer.Name,
      FromAddress: this.order.Company.AddressLine,
      ToAddress: this.order.Customer.AddressLineHome,
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
}
