
import { Component, Input, OnInit } from '@angular/core';
import { Order, User } from 'src/models';
import { AccountService, OrderService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-checkout-customer-info',
  templateUrl: './checkout-customer-info.component.html',
  styleUrls: ['./checkout-customer-info.component.scss']
})
export class CheckoutCustomerInfoComponent implements OnInit {
  @Input() order: Order;
  @Input() user: User;
  edit: boolean;
  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private accountService: AccountService,
    private itemService: ItemService,
  ) { }

  ngOnInit(): void {


  }
  profile() {
    this.edit = !this.edit;
  }

  save(){
    this.userService.updateUserSync(this.user).subscribe(data => {
      if (data && data.UserId === this.user.UserId) {
        this.user = data;
        this.saveAddress();
      }
    })
  }
  saveAddress() {
    if (!this.user)
      return;
    let item = this.user.Items.find(x=>x.Latitude === this.order.Latitude);
    if(!item)
    return
    item.ParentId = this.user.UserId;
    item.AddressLine = this.user.AddressLineHome;
    item.Longitude = this.user.Longitude;
    item.Latitude = this.user.Latitude;
    item.LocationType = this.user.AddressLineWork;
    this.itemService.update(item).subscribe(e => {
      if (e) {
      item = e;
      this.profile();
      this.order.CustomerId = this.user.UserId;
      this.order.CustomerName= this.user.Name;
      this.order.CustomerSurname= this.user.Surname;
      this.order.CustomerEmail= this.user.Email;
      this.order.CustomerPhone= this.user.PhoneNumber;
      this.order.Latitude= this.user.Latitude;
      this.order.Longitude= this.user.Longitude;
      this.order.FullAddress= this.user.AddressLineHome;
      this.orderService.updateOrderState(this.order);
        // this.getUser();
      }
      this.accountService.updateUserState(this.user);
    })
  }

}
