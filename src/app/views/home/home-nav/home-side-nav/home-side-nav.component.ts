import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationModel, User } from 'src/models';
import { AccountService, CompanyCategoryService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, DRIVER, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-home-side-nav',
  templateUrl: './home-side-nav.component.html',
  styleUrls: ['./home-side-nav.component.scss']
})
export class HomeSideNavComponent implements OnInit {
  showMobileNav = true;
  @Output() showMobileMenuEvent: EventEmitter<any> = new EventEmitter<any>();
  items: NavigationModel[];
  @Input() showExistShop: boolean;
  user: User;
  toggleState: string = '';
  constructor(
    private router: Router,
    private uxService: UxService,
    private accountService: AccountService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.loadItems();
  }


  logout() {
    this.showMobileMenuEvent.emit(false)
    this.uxService.hideHomeSideNav();
    this.accountService.logout();
  }
  itemClicked(item: NavigationModel) {
    this.uxService.hideHomeSideNav();
    this.router.navigate([item.Url]);
  }

  loadItems() {
    this.items = [];

    if (this.user) {
      this.items.push(
        {
          Label: 'Profile',
          ImageUrl: `assets/images/profle/menu-profile.png`,
          Url: '/home/profile'
        }
      );
    }


    // this.items.push(
    //   {
    //     Label: 'Promotions',
    //     ImageUrl: `assets/images/profle/promotion.png`,
    //     Url: '/home/promotions'
    //   }
    // );
    if (this.user && this.user.UserType === CUSTOMER) {
      this.items.push(
        {
          Label: 'Order History',
          ImageUrl: `assets/images/profle/menu-orders.png`,
          Url: '/home/my-orders'
        }
      );
    }


    if (this.user && (this.user.UserType === SUPER || this.user.UserType === DRIVER || this.user.UserType === ADMIN)) {
      this.items.push(
        {
          Label: 'Dashboard',
          ImageUrl: `assets/images/profle/menu-orders.png`,
          Url: '/admin/dashboard'
        }
      );
    }

    if (!this.user) {
      this.items.push(
        {
          Label: 'Sign in',
          ImageUrl: `assets/images/profle/menu-profile.png`,
          Url: '/home/sign-in'
        },
        {
          Label: 'Sign up',
          ImageUrl: `assets/images/profle/menu-profile.png`,
          Url: '/home/sign-up'
        }
      );
    }

    this.items.push(
      {
        Label: 'Help',
        ImageUrl: `assets/images/profle/help.png`,
        Url: '/home/contact-us'
      },
      // {
      //   Label: 'About',
      //   ImageUrl: `assets/images/profle/about.png`,
      //   Url: '/home/about'
      // },
      {
        Label: 'Terms',
        ImageUrl: `assets/images/profle/terms.png`,
        Url: '/home/terms'
      }
    );

  }
  toggleMenu(e) {
    this.uxService.hideHomeSideNav();
    this.showMobileMenuEvent.emit(false)
  }
}
