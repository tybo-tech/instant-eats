import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, ITEM_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-hello-page',
  templateUrl: './hello-page.component.html',
  styleUrls: ['./hello-page.component.scss']
})
export class HelloPageComponent implements OnInit {
  slide = 1;
  user: User;
  adresses: SliderWidgetModel[]
  showMenu: boolean;

  constructor(
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private userService: UserService,
    private itemService: ItemService
  ) {
    // const user = accountService.currentUserValue;
    // if (user && user.UserType === CUSTOMER) {
    //   this.goto('home/select-location');
    // }
  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user && this.user.UserType === CUSTOMER) {
        this.checkAddresses();
      }

      if (this.user && this.user.Items.length) {
        this.loadListItems();
      } else {
        this.adresses = [];
        this.adresses.push({
          Id: `add`,
          Name: `Add new location`,
          Description: `This location will be saved in your profile`,
          Link: `event`,
          Icon: `assets/images/roomplus.svg`,
          Style: { 'color': '#27ae60' }
        })
      }
    })
  }
  custom() {
    this.router.navigate(['home/custom-design']);
  }

  checkAddresses() {
    if (this.user.Latitude && this.user.Longitude && (!this.user.Items.length || !this.user.Items.filter(x => x.ItemType === ITEM_TYPES.CUSTOMER_ADDRESS.Name).length)) {
      const item = this.itemService.initItem(ITEM_TYPES.CUSTOMER_DATA.Name, ITEM_TYPES.CUSTOMER_ADDRESS.Name);
      item.ParentId = this.user.UserId;
      item.AddressLine = this.user.AddressLineHome;
      item.Longitude = this.user.Longitude;
      item.Latitude = this.user.Latitude;
      item.LocationType = this.user.AddressLineWork;
      this.itemService.add(item).subscribe(e => {
        if (e) {
          this.getUser();
        }
      })

    }
  }
  getUser() {
    this.userService.getUserSync(this.user.UserId).subscribe(data => {
      if (data && data.UserId) {
        this.accountService.updateUserState(data);
      }
    })
  }
  goto(url) {
    this.router.navigate([url]);
  }
  shop() {
    this.uxService.updateShowIntroPageState(null);
  }
  changeSlide(e) {
    this.slide = e;
  }
  onSwipeLeft(e) {
  }
  onSwipeRight(e) {

  }

  eventText = '';

  onSwipe(evt) {
    alert(evt);
    const x = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left') : '';
    const y = Math.abs(evt.deltaY) > 40 ? (evt.deltaY > 0 ? 'down' : 'up') : '';

    this.eventText += `${x} ${y}<br/>`;
  }
  onToggleMenu(e) {
    this.showMenu = e;
  }
  menu() {
    this.showMenu = !this.showMenu;
  }
  loadListItems() {
    const userAddresses = this.user.Items.filter(x => x.ItemType === ITEM_TYPES.CUSTOMER_ADDRESS.Name);
    if (userAddresses && userAddresses.length) {
      this.adresses = [];
      userAddresses.forEach(item => {
        this.adresses.push({
          Id: `${item.ItemId}`,
          Name: `${item.Name}`,
          Description: `${item.AddressLine}`,
          Link: `event`,
          Icon: `assets/images/room.svg`
        })


      })

      this.adresses.push({
        Id: `add`,
        Name: `Add new location`,
        Description: `This location will be saved in your profile`,
        Link: `event`,
        Icon: `assets/images/roomplus.svg`,
        Style: { 'color': '#27ae60' }
      })
    }
  }


  OnItemSelected(item: SliderWidgetModel) {
    if (item.Id === 'add') {
      this.goto(`home/select-location`);
      return;
    }
    const location = this.user.Items.find(x => x.ItemId === item.Id);
    if (location) {
      if (this.user && this.user.UserType === CUSTOMER) {
        this.user.Latitude = location.Latitude;
        this.user.Longitude = location.Longitude;
        this.user.AddressLineHome = location.AddressLine;
        this.userService.updateUserSync(this.user).subscribe(data => {
          if (data && data.UserId === this.user.UserId) {
            this.accountService.updateUserState(data);
            const locationModel = {
              lat: this.user.Latitude,
              lng: this.user.Longitude,
              addressLine: this.user.AddressLineHome,
              url: ``
            }
            this.uxService.updateLocationState(locationModel);

            this.goto('');
          }
        })
      }
    }
  }
}
