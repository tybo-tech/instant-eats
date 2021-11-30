import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/models/order.model';
import { User } from 'src/models/user.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { UserService } from 'src/services/user.service';
import { ORDER_TABS, ORDER_TYPE_SALES } from 'src/shared/constants';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.scss']
})
export class ListOrdersComponent implements OnInit {
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
  backto = 'Restaurant dashboard'
  companyId: string;
  ORDER_TABS = ORDER_TABS;
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
      if(this.companyId === 'super'){
      this.backto = 'Dashboard'
      }
      this.user = this.accountService.currentUserValue;
      this.orderService.getOrders(this.companyId, this.orderStatus);

    });
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
          this.usersItems.push({
            Name: `${item.Customer?.Name}, R${item.Total}`,
            Description: `${item.Orderproducts.map(x => x.ProductName).toString().substring(0, 100)}`,
            Link: `event`,
            Icon: `assets/images/icon.svg`
          })


        })
      }
    });
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
    if(this.companyId === 'super'){
      this.router.navigate(['admin/dashboard']);
      return;
    }
    this.router.navigate(['admin/dashboard/restaurant', this.companyId]);
  }
  onOrderClicked(order: Order) {
    console.log(order);

  }
}
