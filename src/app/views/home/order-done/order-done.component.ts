import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order, User } from 'src/models';
import { OrderService, AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-order-done',
  templateUrl: './order-done.component.html',
  styleUrls: ['./order-done.component.scss']
})
export class OrderDoneComponent implements OnInit {

  OrderId: string;
  order: Order;
  user: User;
  showAddCancel: boolean;


  formError: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.OrderId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getOrder();
  }
  getOrder() {
    this.orderService.getOrderSync(this.OrderId).subscribe(order => {
      this.order = order;
      if (this.order && Number(this.order.Paid) === 0 && Number(this.order.Due) === 0) {
        this.order.Due = this.order.Total;
      }
    });
  }
  updateOrder() {
    this.showAddCancel = false;
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
      }
    });
  }

  goto(url) {
    this.router.navigate([url]);
  }

  track() {
    this.router.navigate(['home/view-my-order', this.OrderId]);
  }
}
