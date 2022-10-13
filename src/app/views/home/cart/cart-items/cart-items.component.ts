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
import { ItemService } from 'src/services/item.service';
import { Item } from 'src/models/item.model';
import { BASE } from 'src/environments/environment';
import { WebConfig, getConfig } from 'src/shared/web-config';

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
  fees: Item[];
  config: WebConfig;


  constructor(
    private router: Router,
    private orderService: OrderService,
    private accountService: AccountService,
    private location: Location,
    private uxService: UxService,
    private promotionService: PromotionService,
    private itemService: ItemService,

  ) { }

  ngOnInit() {
    this.config = getConfig(BASE);

    this.itemService.feesObservable.subscribe(fees => {
      if (fees && fees.length) {
        this.fees = fees;
      }
    })

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
    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
    this.orderService.updateOrderState(this.order);
  }
  selectShipping(shipping: Shipping) {
    if (shipping) {
      this.shippings.map(x => x.Selected = false);
      shipping.Selected = true;
      this.order.ShippingPrice = shipping.Price;
      this.order.Shipping = shipping.Name;
      this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
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
    if (this.user) {
      this.order.Latitude = this.user.Latitude;
      this.order.Longitude = this.user.Longitude;
      this.order.FullAddress = this.user.AddressLineHome;
    }
    else if (this.locationData) {
      this.order.Latitude = this.locationData.lat;
      this.order.Longitude = this.locationData.lng;
      this.order.FullAddress = this.locationData.addressLine;
    }

    const cord1: LocationModel = {
      lat: this.order.Company.Latitude,
      lng: this.order.Company.Longitude,
      addressLine: ``,
      url: ``
    }



    // const distance = this.uxService.calcCrow(cord1, this.locationData);
    let baseDeliveryFee = 10;
    let baseDeliveryFeePerKM = 5;
    if (this.fees) {
      const del = this.fees.find(x => x.ItemType === 'delivery')
      if (del && del.Price) {
        baseDeliveryFee = +del.Price;
      }
      if (del && del.ItemCode) {
        baseDeliveryFee = +del.ItemCode;
      }
    }
    var p1 = new google.maps.LatLng(Number(this.order.Latitude), Number(this.order.Longitude));
    var p2 = new google.maps.LatLng(Number(this.order.Company.Latitude), Number(this.order.Company.Longitude));
    const distance = this.orderService.calcDistance(p1, p2);
    const shipping = (Math.ceil(Number(distance)) * baseDeliveryFeePerKM) + baseDeliveryFee;
    return Math.floor(shipping);
  }
  qtyChanged(qty, product: Orderproduct) {
    product.Quantity = qty;
    product.SubTotal = product.Quantity * Number(product.UnitPrice)
    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
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
            this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
          }
          if (data.PromoType === DISCOUNT_TYPES[1]) {
            this.order.Orderproducts.forEach(line => {
              // line.UnitPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
              line.DiscountPrice = Number(line.UnitPrice) - Number(data.DiscountValue);
            });
            this.order.Discount = data;
            this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);

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

    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
  }


}
