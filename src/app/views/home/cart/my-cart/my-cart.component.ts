import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { Order, Orderproduct, Product, User } from 'src/models';
import { SHIPPING_OPTIONS } from 'src/models/shipping.model';
import { AccountService, OrderService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.scss']
})
export class MyCartComponent implements OnInit {
  config: WebConfig;

  order: Order;
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();
  user: User;
  shippings = SHIPPING_OPTIONS;
  constructor(
    private orderService: OrderService,
    private homeShopService: HomeShopService,
    private router: Router,
    private interactionService: InteractionService,
    private accountService: AccountService


  ) { }

  ngOnInit() {
    this.config = getConfig(BASE);

    this.order = this.orderService.currentOrderValue;
    this.user = this.accountService.currentUserValue;
    this.interactionService.logHomePage(this.user, 'cart page', JSON.stringify(this.order || ''),"ViewCartPage");
  }


  continueShopping() {
    this.orderService.updateOrderState(this.order);
    this.back();
    // this.checkoutOrShopMoreEvent.emit('shopmore');
    // this.router.navigate([`${this.order.Company.Slug}`]);

  }
  checkout() {
    if (this.order) {
      this.router.navigate(['shop/checkout']);
    }
  }
  back() {
    if (this.order  && this.order.CompanyId) {
      this.router.navigate([`restaurant/${this.order.CompanyId}`]);
      return;
    }

  this.router.navigate(['']);
    return;

  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);
    this.orderService.updateOrderState(this.order);

  }
  goto(url) {
    this.router.navigate([url]);
  }
}
