import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService, UserService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { ADMIN, CUSTOMER, ITEM_TYPES } from 'src/shared/constants';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LocationModel } from 'src/models/UxModel.model';
import { UxService } from 'src/services/ux.service';
import { ItemService } from 'src/services/item.service';

@Component({
  selector: 'app-home-landing',
  templateUrl: './home-landing.component.html',
  styleUrls: ['./home-landing.component.scss']
})
export class HomeLandingComponent implements OnInit {

  selectedCategory: Category;
  currentNav: string;
  categories: Category[];
  isLoading = true;
  user: User;
  shopHander: string;
  navItems: NavigationModel[] = [];
  viewIndex = 0;
  showMobileNav = false;
  locations: LocationModel[] = [];
  constructor(
    private homeShopService: HomeShopService,
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private itemService: ItemService,
    private uxService: UxService,

  ) {

  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    });


  }

  goto(url) {
    if (!isNaN(url)) {
      this.viewIndex = url;
      return;
    }
    this.router.navigate([`home/${url}`]);
  }
  login() {
    this.router.navigate(['sign-in']);
  }

  onAdressEvent(event: LocationModel) {
    console.log(event);
    this.uxService.updateLocationState(event);
    this.router.navigate([``]);

    if (this.user && this.user.UserType === CUSTOMER) {
      this.user.Latitude = event.lat;
      this.user.Longitude = event.lng;
      this.user.AddressLineHome = event.addressLine;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId === this.user.UserId) {
          this.user = data;
          this.saveAddress();
        }
      })
    }

  }

  saveAddress() {
    if (!this.user)
      return;
    const item = this.itemService.initItem(ITEM_TYPES.CUSTOMER_DATA.Name, ITEM_TYPES.CUSTOMER_ADDRESS.Name);
    item.ParentId = this.user.UserId;
    item.AddressLine = this.user.AddressLineHome;
    item.Longitude = this.user.Longitude;
    item.Latitude = this.user.Latitude;
    item.LocationType = this.user.AddressLineWork;
    this.itemService.add(item).subscribe(e => {
      if (e) {
        this.user.Items.push(e);
        // this.getUser();
      }
      this.accountService.updateUserState(this.user);
    })
  }

  back() {
    this.router.navigate([`home/welcome`]);
  }


}


