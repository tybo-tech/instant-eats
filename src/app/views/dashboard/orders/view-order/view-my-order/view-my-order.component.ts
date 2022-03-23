import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Order, User, Email } from 'src/models';
import { ModalModel } from 'src/models/modal.model';
import { OrderService, AccountService, EmailService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { IMAGE_DONE, ITEM_TYPES, MESSAGE_STATUSES, NOTIFY_EMAILS, ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-view-my-order',
  templateUrl: './view-my-order.component.html',
  styleUrls: ['./view-my-order.component.scss']
})
export class ViewMyOrderComponent implements OnInit, OnDestroy {

  OrderId: any;
  order: Order;
  showAdd: boolean;
  user: User;
  showAddCancel: boolean;

  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Go to orders',
    routeTo: '/admin/dashboard/invoices',
    img: undefined
  };
  formError: string;
  timeInterval: any;
  subscription: any;
  progress: string;
  messegeCount: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private accountService: AccountService,
    private emailService: EmailService,
    private uxService: UxService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.OrderId = r.id;
      this.getOrder();
    });
  }

  ngOnInit() {

    this.timeInterval = interval(7000);
    this.subscription = this.timeInterval.subscribe(() => {
      this.getOrder();
    })


  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }


  getOrder() {
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

        if (order && Number(order.Paid) === 0 && Number(order.Due) === 0) {
          order.Due = order.Total;
        }
        this.order = order;
        if (this.order) {
          const index = ORDER_STATUSES.indexOf(this.order.Status) + 1;
          const progress = (index / (ORDER_STATUSES.length)) * 100;
          this.progress = `${Math.floor(progress)}%`
        }

        const newMessages = this.order.Items.filter(x => x.ItemType === ITEM_TYPES.CHAT.Name && x.ItemStatus === MESSAGE_STATUSES.SENT.Name && x.CreateUserId === order.DriverId);
        this.messegeCount = newMessages.length;
      }




    });
  }
  orderAction(action: string) {
    if (action === 'Cancel') {
      this.showAddCancel = true;
    }
    if (action === 'Accept') {
      this.showAdd = true;
    }
  }
  updateOrder() {
    this.showAdd = false;
    this.showAddCancel = false;
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.modalModel.heading = `Order accepted and in it is in progress.`
        this.modalModel.img = IMAGE_DONE;
        this.modalModel.ctaLabel = 'Go to dashboard';
        this.modalModel.routeTo = `admin/dashboard`;
        this.modalModel.body.push(`Order accepted.`);
        this.modalModel.body.push(`Please press "Ship order"  on the order screen when the order is shipped`);

        const body = `Congratulations, your order has been accepted by the seller and it is in progress.
        The estimated shipping date is : ${this.order.EstimatedDeliveryDate}.
        We will send you the email as soon the seller confirms the shipment.
        
        `;
        this.sendEmailLogToShop(body, this.order.CustomerName, this.order.CustomerEmail);
        this.sendEmailLogToShop(body, this.order.CustomerName, NOTIFY_EMAILS);
      }
    });
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
      this.router.navigate([url]);
    }
  }

  reOrder() {
    this.orderService.reOrder(this.order);
  }

}
