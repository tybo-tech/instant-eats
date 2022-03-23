import { Component, OnDestroy, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { interval } from 'rxjs/internal/observable/interval';
import { Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { DELIVERY_REQUEST_STATUSES, DRIVER_STATUSES, ITEM_TYPES, MESSAGE_STATUSES, ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.scss']
})
export class DriverDashboardComponent implements OnInit, OnDestroy {
  user: User;
  timeInterval: any;
  subscription: any;
  audio: HTMLAudioElement;
  utter: SpeechSynthesisUtterance;
  DELIVERY_REQUEST_STATUSES = DELIVERY_REQUEST_STATUSES;
  DRIVER_STATUSES = DRIVER_STATUSES;
  acceptedRequest: Item;
  declinedRequest: Item;
  order: Order;
  progress: string;
  currentRequestOnCount: Item;
  messegeCount: number;
  requestInterval: any;
  countDown: number;
  requestSubscription: any;
  request: Order;
  countDownInterval: any;
  countDownSubscription: any;


  constructor(private accountService: AccountService,
    private orderService: OrderService,
    private userService: UserService, private itemService: ItemService) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      if (data && data.UserId) {
        this.user = data;
        if (data) {
          if (this.user && !this.user.Latitude)
            this.getCurrentLocation();

          if (data.Requests.length && !this.request) {
            this.request = data.Requests[0];
          }

          if (!data.Requests.length) {
            this.request = null;
          }

          if (data.AcceptedOrders.length) {
            this.order = data.AcceptedOrders[0];
          } else {
            this.order = null;
          }
        }
      }
    });

    this.utter = new SpeechSynthesisUtterance();
    this.audio = new Audio();
    this.audio.src = "assets/sound.mp3";
    this.audio.load();
    this.getUser();



    this.timeInterval = interval(7000);
    this.subscription = this.timeInterval.subscribe(() => {
      this.getCurrentLocation();
    })


    this.countDownInterval = interval(1000);
    this.countDownSubscription = this.countDownInterval.subscribe(() => {
      if (this.request)
        this.request.DriverCount = this.orderService.getSeconds(this.request.DriverRequestLastModified);

    })
  }


  getCurrentLocation() {

    this.userService.getUserSync(this.user.UserId).subscribe(__user => {
      if (__user && __user.UserId) {
        const _this = this;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            __user.UserStatus = DRIVER_STATUSES.ONLINE.Name;
            __user.Latitude = pos.lat;
            __user.Longitude = pos.lng;
            _this.updateUser(__user);
          });
        }
      }
    })

  }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
  }
  back() {

  }

  getUser() {
    // return;
    if (!this.user || this.user.UserStatus === DRIVER_STATUSES.OFFLINE.Name)
      return;


    this.userService.getUserSync(this.user.UserId).subscribe(user => {
      if (user && user.UserId) {
        this.accountService.updateUserState(user);
        if (user.AcceptedOrders.length) {
          this.order = user.AcceptedOrders[0];
        } else {
          this.order = null;
        }
      }
    })
  }


  logOnOff() {
    this.beep();
    if (this.user.UserStatus === DRIVER_STATUSES.ONLINE.Name) {
      this.user.UserStatus = DRIVER_STATUSES.OFFLINE.Name;
      this.subscription.unsubscribe();
      // this.speak('Now you are offline, you will receive requests when you online again.')
      this.updateUser();
      return;
    }

    if (this.user.UserStatus === DRIVER_STATUSES.OFFLINE.Name) {
      this.user.UserStatus = DRIVER_STATUSES.ONLINE.Name;
      this.updateUser();
      this.subscription = this.timeInterval.subscribe(() => {
        this.getUser();
      })
      return;
    }


  }
  speak(words: string) {
    this.utter.lang = 'en-US';
    this.utter.text = words;
    this.utter.volume = 1;
    this.utter.rate = 1;

    // event after text has been spoken
    this.utter.onend = function () {
    }

    // speak
    window.speechSynthesis.speak(this.utter);
  }
  updateUser(user = this.user) {
    this.userService.updateUserSync(user).subscribe(data => {
      if (data && data.UserId) {
        this.accountService.updateUserState(data);
      }
    })
  }

  onCords(event: LocationModel) {
    if (event) {
      this.user.Latitude = event.lat;
      this.user.Longitude = event.lng;
      this.user.AddressLineHome = event.addressLine;
      this.user.AddressUrlHome = event.url;
      this.updateUser()
    }
  }

  mokcUpdate(item: Item, itemStatus) {
    return;
    item.ItemStatus = itemStatus
    this.itemService.update(item).subscribe(data => {
      console.log(data);
    })
  }

  // onRequestEvent(request: Item) {
  //   if (!request)
  //     return;
  //   this.speak(`Request ${request.ItemStatus}`);
  //   if (request.ItemStatus === DELIVERY_REQUEST_STATUSES.ACCEPTED.Name) {
  //     this.user.UserStatus = DRIVER_STATUSES.BUSY.Name;
  //     this.updateUser();
  //     // this.updateOrder(request.ParentId);
  //   }
  //   if (request.ItemStatus === DELIVERY_REQUEST_STATUSES.DECLINED.Name) {

  //   }
  // }


  onRequestEvent(order: Order) {
    if (!order)
      return;

    // this.request = null;
    this.user.DriverStatus = order.DriverStatus;
    this.updateUser(this.user);
  }


  updateOrder() {
    this.orderService.update(this.order).subscribe(e => {
      if (e) {
        this.order = e;
      }
    });
  }

  logOff() {
    this.accountService.logout();
  }


  updateItem(item: Item) {
    this.itemService.update(item).subscribe(data => {
      if (data && data.ItemId) {
      }
    })
  }

  beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
  }
}


