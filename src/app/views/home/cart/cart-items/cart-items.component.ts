import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, Orderproduct, User } from 'src/models';
import { Shipping, SHIPPING_OPTIONS } from 'src/models/shipping.model';
import { AccountService } from 'src/services';
import { OrderService } from 'src/services/order.service';
import { Location } from '@angular/common';
import { UxService } from 'src/services/ux.service';
import { LocationModel } from 'src/models/UxModel.model';
import { PromotionService } from 'src/services/promotion.service';
import { DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss']
})
export class CartItemsComponent implements OnInit {
  @Input() order: Order;
  @Input() hideDelete;
  @Input() page;
  @Input() shippings: Shipping[];
  @Input() Class: string[];
  user: User;
  showAdd;
  maxItems = 999999999;
  pickup = 'secondary';
  delivery = 'primary';
  SHIPPING_OPTIONS = SHIPPING_OPTIONS;
  locationData: LocationModel;
  discountAmount: number;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,
    private promotionService: PromotionService,

  ) { }

  ngOnInit() {

    this.uxService.locationObservable.subscribe(data => {
      if (data) {
        this.locationData = data;
      }
    })
    this.user = this.accountService.currentUserValue;
    if (this.shippings && this.shippings.length) {
      if (this.order && this.order.Shipping) {
        const ship = this.shippings.find(x => x.Name === this.order.Shipping);
        if (ship && ship.ShippingId === 'delivery') {
          this.switchPickUpMode(SHIPPING_OPTIONS[1].ShippingId);
        }
        if (ship && ship.ShippingId === 'collect') {
          this.switchPickUpMode(SHIPPING_OPTIONS[0].ShippingId);
        }
      } else {
        this.switchPickUpMode(SHIPPING_OPTIONS[1].ShippingId);
      }
    }

  }
  back() {
    this.location.back();
  }

  deleteItem(item: Orderproduct, i) {
    this.order.Total -= Number(item.UnitPrice);
    this.order.Orderproducts.splice(i, 1);

    if (this.order.Orderproducts.length === 0) {
      this.order.Shipping = undefined;
      this.order.ShippingPrice = undefined;
    }
    this.order = this.orderService.calculateTotalOverdue(this.order);
    this.orderService.updateOrderState(this.order);
  }
  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.order = this.orderService.calculateTotalOverdue(this.order);
      this.orderService.updateOrderState(this.order);
      this.showAdd = false;
    }
  }


  profile() {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate(['home/edit-myprofile'])
  }

  updateOrder() {
    this.orderService.updateOrderState(this.order);
  }

  switchPickUpMode(mode: string) {
    if (mode == this.SHIPPING_OPTIONS[0].ShippingId) { // collect
      this.pickup = 'primary';
      this.delivery = 'secondary';
      this.selectShipping(this.SHIPPING_OPTIONS[0]);

    }
    if (mode == this.SHIPPING_OPTIONS[1].ShippingId) { // delivery
      this.pickup = 'secondary';
      this.delivery = 'primary';
      const shipping = this.SHIPPING_OPTIONS[1];
      shipping.Price = this.calucalateShipping();
      this.selectShipping(shipping);

    }
    if (mode == this.SHIPPING_OPTIONS[2].ShippingId) { // delivery
      this.pickup = 'secondary';
      this.delivery = 'primary';
      const shipping = this.SHIPPING_OPTIONS[2];
      shipping.Price = shipping.Price;
      this.selectShipping(shipping);

    }

  }
  calucalateShipping() {
    const cord1: LocationModel = {
      lat: this.order.Company.Latitude,
      lng: this.order.Company.Longitude,
      addressLine: ``,
      url: ``
    }



    // const distance = this.uxService.calcCrow(cord1, this.locationData);

    var p1 = new google.maps.LatLng(Number(this.user.Latitude), Number(this.user.Longitude));
    var p2 = new google.maps.LatLng(Number(this.order.Company.Latitude), Number(this.order.Company.Longitude));
    const distance = this.orderService.calcDistance(p1, p2);
    const shipping = (Math.ceil(Number(distance)) * 5) + 1.5;

    return Math.floor(shipping);
  }
  qtyChanged(qty, product: Orderproduct) {
    product.Quantity = qty;
    product.SubTotal = product.Quantity * Number(product.UnitPrice)
    this.order = this.orderService.calculateTotalOverdue(this.order);
    this.orderService.updateOrderState(this.order);

  }

  promoChanged() {
    if (this.order.PromoCode) {
      if (this.order.Discount) {
        this.removePromo();
      }
      this.promotionService.getByCode(this.order.PromoCode).subscribe(data => {
        if (data && data.PromotionId) {
          if (data.PromoType === DISCOUNT_TYPES[0]) {
            // % off
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
              line.DiscountPrice = Number(line.UnitPrice) - (line.UnitPrice * (Number(data.DiscountValue) / 100));
            });
            this.order.Discount = data;
            this.order = this.orderService.calculateTotalOverdue(this.order);
          }
          if (data.PromoType === DISCOUNT_TYPES[1]) {
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
              line.DiscountPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
            });
            this.order.Discount = data;
            this.order = this.orderService.calculateTotalOverdue(this.order);

          }

          if (data.PromoType === DISCOUNT_TYPES[2]) {

            this.order.Discount = data;
            this.order.FreeShipping = true;
            this.switchPickUpMode(SHIPPING_OPTIONS[2].ShippingId);
          }

        }
      })
    }
  }

  removePromo() {
    this.order.Orderproducts.forEach(line => {
      line.DiscountPrice = undefined;
    });
    this.order.Discount = undefined;
    if (this.order.FreeShipping) {
      this.order.FreeShipping = undefined;
      this.switchPickUpMode(SHIPPING_OPTIONS[1].ShippingId);
    }

    this.order = this.orderService.calculateTotalOverdue(this.order);
  }


}
