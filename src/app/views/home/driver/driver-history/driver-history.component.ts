import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, User, Email } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { OrderService, EmailService, AccountService } from 'src/services';
import { IMAGE_DONE, NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss']
})
export class DriverHistoryComponent implements OnInit {
  @Input() orders: Order[];
  @Input() user: User;
  order: Order;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Shop again',
    routeTo: '',
    img: undefined
  };
  constructor(
    private orderService: OrderService,
    private emailService: EmailService,
    private accountService: AccountService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.UserId) {
      this.orderService.getOrdersByUserIdSync(this.user.UserId).subscribe(data => {

        if (data) {
          this.orders = data;
          // this.orders.forEach(order => {
          //   if (order.Orderproducts && order.Orderproducts.length) {
          //     order.Orderproducts.forEach(item => {
          //       if (item.OrderOptions) {
          //         item.OrderOptions = JSON.parse(item.OrderOptionsString)
          //       }
          //     })
          //   }
          // })
        }
      })
    }

  }
  confirmDelivery(order: Order) {
    this.order = order;
    this.order.Status = 'Delivered';
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.modalModel.heading = `Success!`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.routeTo = `my-orders`;
        this.modalModel.body.push(`Thanks for confirming the delivery.`);
        this.order = data;
        this.orderService.updateOrderState(this.order);

        const body = `Well done!, ${this.user.Name} confirmed the order delivery`;
        const company = this.order.Company;
        if (company && company.Email) {
          this.sendEmailLogToShop(body, company.Name || '', company.Email);
          this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);

        }
      }
    }
    );
  }

  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: `Order ${this.order.OrderNo} delivered`,
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

  goto(url: string) {

    this.router.navigate([url]);
  }

  back() {

    // this.navAction.emit(true);
    this.router.navigate(['driver/dashboard']);
  }

}
