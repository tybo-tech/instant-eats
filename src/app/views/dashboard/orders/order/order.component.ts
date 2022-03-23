import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Email, User } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { Order } from 'src/models/order.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UxService } from 'src/services/ux.service';
import { ACTIVEORDERS, ADMIN, DRIVER, HISTORYORDERS, IMAGE_DONE, NOTIFY_EMAILS, ORDER_STATUSES, PENDINGORDERS, SUPER } from 'src/shared/constants';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EmailService } from 'src/services/communication/email.service';
import { CompanyService } from 'src/services/company.service';
import { Delivery } from 'src/models/delivery.model';
import { DeliveryService } from 'src/services/delivery.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  OrderId: any;
  order: Order;
  showAdd: boolean;
  user: User;
  showAddCancel: boolean;
  PENDINGORDERS = PENDINGORDERS;
  ORDER_STATUSES = ORDER_STATUSES;
  drivers: User[];
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to orders',
    routeTo: '/admin/dashboard/invoices',
    img: undefined
  };
  formError: string;
  showAssignDrivers: boolean;
  selectedOrder: Order;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private uxService: UxService,
    private companyService: CompanyService,
    private deliveryService: DeliveryService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.OrderId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;



    this.orderService.getOrderSync(this.OrderId).subscribe(order => {
      if (order && order.OrdersId) {
        if (order.Orderproducts && order.Orderproducts.length) {
          order.Orderproducts.forEach(item => {
            if (item.OrderOptionsString) {
              item.OrderOptions = JSON.parse(item.OrderOptionsString)
            } else {
              item.OrderOptions = [];
            }
          })
        }
      }

      this.order = order;

      if (this.order && Number(this.order.Paid) === 0 && Number(this.order.Due) === 0) {
        this.order.Due = this.order.Total;
      }
    });
  }



  validateDate() {
    this.formError = undefined;
    const todaysDate = new Date();
    todaysDate.setDate(todaysDate.getDate());
    if (new Date(this.order.EstimatedDeliveryDate).getTime() < todaysDate.getTime()) {
      this.formError = 'Sorry, the date can not be in the past!';
      this.order.EstimatedDeliveryDate = undefined;

    }
  }

  print() {
    this.uxService.showQuickMessage('Invoice downloading ...');
    const url = this.orderService.getInvoiceURL(this.order.OrdersId);
    const win = window.open(url, '_blank');
    win.focus();
  }

  goto(url: string) {

    if (url === 'home/my-orders' && this.user) {
      this.router.navigate([url]);
    }

    if (url === 'home/my-orders' && !this.user) {
      this.uxService.keepNavHistory({
        BackToAfterLogin: url,
        BackTo: url,
        ScrollToProduct: null
      });
      this.router.navigate(['home/sign-in']);
    }
    if (url === '') {
      this.router.navigate([`admin/dashboard/invoices/${this.order.StatusId}/${this.user.CompanyId}`]);
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

      this.companyService.getUsersNearBy(order.Company.Latitude, order.Company.Longitude, Number(order.Company.Radius || 10), DRIVER, order.OrdersId).subscribe(data => {
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

        const body = `Congratulations, your order has been accepted by the seller and it is in progress.
        The estimated shipping date is : ${this.order.EstimatedDeliveryDate}.
        We will send you the email as soon the seller confirms the shipment.
        
        `;
        this.sendEmailLogToShop(body, this.order.CustomerName, this.order.CustomerEmail);
        this.sendEmailLogToShop(body, this.order.CustomerName, NOTIFY_EMAILS);
        this.sendEmailRange(this.order.Company.Name, this.order.Company.AddressLine);
      }
    });
  }

  saveAssignDriver(user: User) {
    this.selectedOrder.DriverId = user.UserId;
    this.selectedOrder.DriverName = user.Name;
    this.orderService.update(this.selectedOrder).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.showQuickMessage(`Driver Assigned.`);
        this.showAssignDrivers = false;


        // const body = `Congratulations, your order has been accepted by the seller and it is in progress.
        // The estimated shipping date is : ${this.order.EstimatedDeliveryDate}.
        // We will send you the email as soon the seller confirms the shipment.

        // `;
        // this.sendEmailLogToShop(body, user.Name, user.Email);
        // this.sendEmailLogToShop(body,user.Name, NOTIFY_EMAILS);
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
}
