import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User, Order } from 'src/models';
import { Company } from 'src/models/company.model';
import { Item } from 'src/models/item.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ITEM_TYPES, CUSTOMER, DRIVER } from 'src/shared/constants';

@Component({
  selector: 'app-rate-driver',
  templateUrl: './rate-driver.component.html',
  styleUrls: ['./rate-driver.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class RateDriverComponent implements OnInit {

  user: User;
  orderId: string;
  order: Order;
  // item: Item;
  rating: Item;
  val1: number;

  val2: number = 3;

  val3: number = 5;

  val4: number = 5;

  val5: number;

  msg: string;
  rates = ['pi pi-star', 'pi pi-star', 'pi pi-star', 'pi pi-star', 'pi pi-star'];
  readOnly: boolean;
  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private itemService: ItemService,
    private uxService: UxService,
    private userService: UserService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getOrder();

  }

  clickRate(max: number) {
    if (this.readOnly)
      return;
    // this.rates.forEach(x => x = 'pi pi-star');
    for (let i = 0; i < this.rates.length; i++) {
      this.rates[i] = 'pi pi-star';
    }
    for (let i = 0; i <= max; i++) {
      this.rates[i] = 'pi pi-star-fill';
    }

    this.rating.ItemCode = `${max + 1}`;
    // alert(i)
    // this.rates.map(x => x = 'pi pi-star-fill');
  }

  getOrder(skipLoad = false) {
    this.user = this.accountService.currentUserValue;
    this.orderService.getOrderSync(this.orderId).subscribe(order => {
      if (order && order.OrdersId) {
        this.order = order;
        this.rating = order.Items.find(x => x.ItemType === ITEM_TYPES.RATING.Name);

        if (!this.rating)
          this.load();
        if (this.rating && this.rating.ItemId) {
          this.clickRate(Number(this.rating.ItemCode) - 1);
          this.readOnly = true;
        }
      }

    });
  }
  back() {
    if (this.user.UserType === CUSTOMER)
      this.router.navigate([`/home/view-my-order/${this.orderId}`])

    if (this.user.UserType === DRIVER)
      this.router.navigate([`/driver/dashboard/${this.orderId}`])
  }
  load() {
    this.rating = this.itemService.initItem(ITEM_TYPES.RATING.Name, ITEM_TYPES.RATING.Name);
    this.rating.ParentId = this.orderId;
    this.rating.RelatedId = this.user.UserId;
    if (this.user && this.user.UserType === CUSTOMER) {
      this.rating.RelatedParentId = this.order.DriverId;
    }
    if (this.user && this.user.UserType === DRIVER) {
      this.rating.RelatedParentId = this.order.CustomerId;
    }

  }
  send() {
    if (this.rating.CreateDate) {
      this.itemService.update(this.rating).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Rating edited`);
          this.order.DriverRating = data.ItemCode;
          this.order.DriverRatingNotes = data.Description;
          this.updateOrder();
          this.rating = data;
          // this.back();
        }

      });
    } else {
      this.itemService.add(this.rating).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Rating submited.`);
          this.order.DriverRating = data.ItemCode;
          this.order.DriverRatingNotes = data.Description;
          this.updateOrder();
          this.rating = data;
          // this.back();
        }


      });
    }
  }

  updateOrder() {
    this.orderService.update(this.order).subscribe(data => {
      if (data)
        this.order = data;

    })
  }
}
