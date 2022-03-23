import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { Order, User } from 'src/models';
import { AccountService, OrderService, UserService } from 'src/services';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { VAPID_PUBLIC_KEY } from 'src/shared/constants';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  user: User;
  order: any;
  orders = [];
  showEnableNotificationsButtion: boolean;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(
    private accountService: AccountService,
    private location: Location,
    private routeTo: Router,
    private orderService: OrderService,
    private userService: UserService,
    private swPush: SwPush


  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (this.user && this.user.UserId) {
      this.orderService.getOrdersByUserIdSync(this.user.UserId).subscribe(data => {

        if (data) {
          this.orders = data;
        }
      });

      if (this.user.AddressUrlWork)
        this.userService.notify({
          subscribtion: JSON.parse(this.user.AddressUrlWork), payload: {
            title: 'Welcome to your profile',
            body: 'Hello ' + this.user.Name,
            label1: 'Sure!',
            label2: 'Sign in',
            image: `https://instanteats.co.za/api/api/upload/uploads/1629010014iio.jpg`,
            icon: `https://instanteats.co.za/api//api/upload/uploads/1646145462iio.jpg`,
            url1: 'https://instanteats.co.za/home/sign-in',
            url2: 'https://instanteats.co.za/home/sign-up'
          }
        }).subscribe(e => {
          console.log(e);


        });
    }

    this.showEnableNotificationsButtion = !this.swPush.isEnabled;
    console.log('swPush: ', this.swPush.isEnabled);
    console.log(
      this.swPush.subscription
    );


    this.swPush.subscription
      .subscribe(pushSubscription => {
        if (pushSubscription) {
          console.log('Active subscription', pushSubscription) // never gets called
        }
        else {
          console.log('No active subscription')
        }
      }, err => { console.log("swpush.subscription error", err); })
  }
  back() {
    this.routeTo.navigate(['']);
  }
  logout() {
    this.user = null;
    this.accountService.updateUserState(null);
    this.routeTo.navigate(['']);
  }

  edit() {
    this.routeTo.navigate(['home/edit-myprofile']);
  }
  dashboard() {
    this.routeTo.navigate(['admin/dashboard']);
  }
  view(order: Order) {

  }
  myorders() {
    this.routeTo.navigate(['home/my-orders']);
  }


}
