import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE, environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Delivery } from 'src/models/delivery.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, EmailService, OrderService } from 'src/services';
import { DeliveryService } from 'src/services/delivery.service';
import { UxService } from 'src/services/ux.service';
import { DRIVER_TABS, NOTIFY_EMAILS, ORDER_PAYMENT_STATUSES, ORDER_STATUSES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.scss']
})
export class DeliveriesComponent implements OnInit {
  deliveries: Delivery[];
  pendingDeliveries: Delivery[];
  activeDeliveries: Delivery[];
  myDeliveries: Delivery[];
  user: User;
  superMenu: SliderWidgetModel[] = [];
  loading: boolean
  statusId: string;
  DRIVER_TABS = DRIVER_TABS;
  ORDER_STATUSES = ORDER_STATUSES;
  delivery: Delivery;
  modalHeading: string;
  config: WebConfig = getConfig(BASE);
  constructor(
    private deliveryService: DeliveryService,
    private uxService: UxService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private emailService: EmailService,
    private orderService: OrderService,
    private router: Router,



  ) {

    this.activatedRoute.params.subscribe(r => {
      this.statusId = r.id;
      this.DRIVER_TABS.map(x => x.Class = []);
      const currentTab = this.DRIVER_TABS.find(x => x.Name.toLowerCase() === this.statusId.toLowerCase());
      if (currentTab) {
        currentTab.Class = ['active']
      }
      this.DRIVER_TABS.forEach(item => {

      })
      this.user = this.accountService.currentUserValue;
      if (!this.user || !this.user.Company) {
        this.router.navigate(['home/sign-in'])
        return;
      }

      this.getDeliveries();
    });
  }

  ngOnInit() {

  }

  goto(currentTab: { Name: string, Class: any[] }) {
    this.DRIVER_TABS.map(x => x.Class = []);

    currentTab.Class = ['active']

    this.router.navigate([`admin/dashboard/deliveries/${currentTab.Name.toLowerCase()}`])
  }
  getDeliveries() {
    this.loading = true;
    this.deliveryService.getNearBy(this.user.Latitude, this.user.Longitude, 35, this.user.UserId).subscribe(data => {
      this.pendingDeliveries = data || [];
      this.getByDriverIdOtherId();
      this.loading = false;

    })
  }
  back() {
    this.router.navigate(['/admin/dashboard']);
  }
  getByDriverIdOtherId() {
    this.loading = true;
    const status = this.statusId != 'history' ? 1 : 2;
    this.deliveryService.getByDriverIdOtherId(this.user.UserId, status).subscribe(data => {
      this.myDeliveries = data || [];
      this.loadWidget();
      this.loading = false;

    })
  }

  loadWidget() {
    this.superMenu = [];
    if (this.statusId.toLowerCase() === DRIVER_TABS[0].Name.toLowerCase()) {
      this.pendingDeliveries.forEach(ad => {
        this.superMenu.push(
          {
            Id: ad.DeliveryId,
            Name: ad.DirectionFrom && `${ad.DirectionFrom.substring(0, 45)}...` || '',
            Description: ad.DirectionTo && `${ad.DirectionTo.substring(0, 45)}...` || '',
            Link: `event`,
            Icon: `assets/images/destination.svg`,
            PaymentType: ORDER_PAYMENT_STATUSES.find(x => x.Name === ad.Order?.FulfillmentStatus).ShortName,
            Status: this.statusId,
            OrderNo: ad.Order.OrderNo,
            OrderStatus: ad.Order.Status,
          }
        )
      })
    }


    if (this.statusId.toLowerCase() === DRIVER_TABS[1].Name.toLowerCase()) {
      this.myDeliveries.forEach(ad => {
        this.superMenu.push(
          {
            Id: ad.DeliveryId,
            Name: ad.DirectionFrom && `${ad.DirectionFrom.substring(0, 45)}...` || '',
            Description: ad.DirectionTo && `${ad.DirectionTo.substring(0, 45)}...` || '',
            Link: `event`,
            Icon: `assets/images/destination.svg`,
            PaymentType: ORDER_PAYMENT_STATUSES.find(x => x.Name === ad.Order?.FulfillmentStatus).ShortName,
            Status: this.statusId,
            OrderNo: ad.Order.OrderNo,
            OrderStatus: ad.Order.Status,
          }
        )
      })
    }

    
    if (this.statusId.toLowerCase() === DRIVER_TABS[2].Name.toLowerCase()) {
      this.myDeliveries.forEach(ad => {
        this.superMenu.push(
          {
            Id: ad.DeliveryId,
            Name: ad.DirectionFrom && `${ad.DirectionFrom.substring(0, 45)}...` || '',
            Description: ad.DirectionTo && `${ad.DirectionTo.substring(0, 45)}...` || '',
            Link: `event`,
            Icon: `assets/images/destination.svg`,
            PaymentType: ORDER_PAYMENT_STATUSES.find(x => x.Name === ad.Order?.FulfillmentStatus).ShortName,
            Status: this.statusId,
            OrderNo: ad.Order.OrderNo,
            OrderStatus: ad.Order.Status,
          }
        )
      })
    }

  }

  accept(delivery: Delivery) {
    delivery.DriverDp = this.user.Dp;
    delivery.DriverName = this.user.Name;
    delivery.DriverReg = this.user.CarReg;
    delivery.DriverId = this.user.UserId;
    delivery.DeliverStatus = ORDER_STATUSES[1];
    this.deliveryService.update(delivery).subscribe(data => {
      console.log(data);
      this.goto(DRIVER_TABS[1]);
      this.getDeliveries();
      this.uxService.showQuickMessage("Delivery Accepted.")
    })
  }



  finish(delivery: Delivery) {
    delivery.DeliverStatus = ORDER_STATUSES[5];
    delivery.StatusId = 2;
    this.deliveryService.update(delivery).subscribe(data => {
      console.log(data);
      this.goto(DRIVER_TABS[2]);
      this.getDeliveries();
      this.uxService.showQuickMessage("Delivery Completed.")
    })
  }

  reject(delivery: Delivery) {
    this.uxService.showQuickMessage("Delivery Rejected")
    delivery = null;
    return 1;
    delivery.DriverDp = this.user.Dp;
    delivery.DriverName = this.user.Name;
    delivery.DriverId = this.user.UserId;
    delivery.DeliverStatus = 'Rejected';
    this.deliveryService.update(delivery).subscribe(data => {
      console.log(data);
      this.getDeliveries();
      this.uxService.showQuickMessage("Delivery Rejected")
    })
  }


  OnItemSelected(item: SliderWidgetModel) {

    if (item.Status.toLowerCase() === DRIVER_TABS[0].Name.toLowerCase()) {
      this.delivery = this.pendingDeliveries.find(x => x.DeliveryId === item.Id);
      this.modalHeading = 'View or edit food item'
    }

    if (item.Status.toLowerCase() === DRIVER_TABS[1].Name.toLowerCase()) {
      this.delivery = this.myDeliveries.find(x => x.DeliveryId === item.Id);
      this.modalHeading = 'View or edit food item'
    }
  }

  updateOrder(order: Order, status: string) {
    order.Status = status;
    this.orderService.update(order).subscribe(data => {
      if (data && data.OrdersId) {
        order = data;
        if (status === ORDER_STATUSES[4]) {
          const body = `Your order <b>${order.OrderNo}</b> is on its way. Click here to track the driver.`;
          this.sendEMail(
            body,
            order.CustomerName,
            order.CustomerEmail,
            order, 'Driver picked up the order from '+this.config.WebCatergoryNameSingular,
            `${environment.BASE_URL}/home/view-my-order/${order.OrdersId}`,
            'Track driver'
          );
        }
        if (status === ORDER_STATUSES[5]) {
          this.finish(this.delivery);
          const body = `Order <b>${order.OrderNo}</b> has has beed delivered by the driver.`;
          this.sendEMail(
            body,
            order.Company.Name,
            order.Company.Email,
            order, 'Driver delivered the order',
            `${environment.BASE_URL}/home/view-my-order/${order.OrdersId}`,
            'Track driver'
          );
        }

      }
    });
  }

  sendEMail(data, companyName: string, email: string, order: Order, subject = '', link = null, label = null) {
    const emailToSend: Email = {
      Email: email,
      Subject: subject,
      Message: `${data}`,
      UserFullName: companyName,
      Link: link,
      LinkLabel: label
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
}
