import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { BASE } from 'src/environments/environment';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UserService } from 'src/services/user.service';
import { ORDER_TABS, ORDER_TYPE_SALES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit, OnDestroy {
  orders: Order[];
  allOrders: Order[];
  user: User;
  modalHeading = 'Add Order';
  showModal: boolean;
  showAddCustomer: boolean;
  orderStatus: number;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  noData = 'No items records found'
  config: WebConfig = getConfig(BASE);
  backto = `Restaurant ${this.config.WebCatergoryNameSingular}`
  companyId: string;
  ORDER_TABS = ORDER_TABS;
  requestInterval: Observable<number>;
  requestSubscription: Subscription;
  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.orderStatus = Number(r.status || "0");
      const currentTab = ORDER_TABS.find(x => x.Id === this.orderStatus);
      if (currentTab) {
        this.ORDER_TABS.map(x => x.Class = []);
        currentTab.Class = ['active']
      }
      this.companyId = r.id;
      if (this.companyId === 'super') {
        this.backto = 'Dashboard'
      }
      this.user = this.accountService.currentUserValue;
      this.orderService.getOrders(this.companyId, this.orderStatus);

    });
  }
  ngOnDestroy(): void {
    this.requestSubscription.unsubscribe();
  }

  ngOnInit() {
    this.orderService.OrderListObservable.subscribe(data => {
      this.allOrders = data;
      if (this.orderStatus) {
        this.orders = this.allOrders.filter(x => Number(x.StatusId) === this.orderStatus);
      } else {
        this.orders = this.allOrders;
      }

      if (this.orders && this.orders.length) {
        this.usersItems = [];
        this.orders.forEach(item => {
          if (!item.Orderproducts)
            item.Orderproducts = [];
          this.usersItems.push({
            Name: `${item.Customer?.Name}, R${item.Total}`,
            Description: `${item.Orderproducts.map(x => x.ProductName).toString().substring(0, 100)}`,
            Link: `event`,
            Icon: `assets/images/icon.svg`
          })


        })
      }
    });

    this.requestInterval = interval(10000);
    this.requestSubscription = this.requestInterval.subscribe(() => {
      this.orderService.getOrders(this.companyId, this.orderStatus);
    })
  }

  goto(currentTab) {
    this.ORDER_TABS.map(x => x.Class = []);

    currentTab.Class = ['active']

    this.router.navigate([`admin/dashboard/invoices/${currentTab.Id}/${this.companyId}`])
  }

  view(order: Order) {
    this.orderService.updateOrderState(order);
    this.router.navigate(['admin/dashboard/order', order.OrdersId]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    this.orderService.updateOrderState({
      OrdersId: '',
      OrderNo: 'Shop',
      CompanyId: this.user.CompanyId,
      CustomerId: '',
      Customer: undefined,
      AddressId: '',
      Notes: '',
      OrderType: ORDER_TYPE_SALES,
      Total: 0,
      Paid: 0,
      Due: 0,
      InvoiceDate: new Date(),
      DueDate: '',
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      Status: 'Not paid',
      StatusId: 1,
      Orderproducts: []
    });
    this.router.navigate(['admin/dashboard/create-order']);
  }
  back() {
    if (this.companyId === 'super') {
      this.router.navigate(['admin/dashboard']);
      return;
    }
    this.router.navigate(['admin/dashboard/restaurant', this.companyId]);
  }
  onOrderClicked(order: Order) {
    console.log(order);

  }
}
