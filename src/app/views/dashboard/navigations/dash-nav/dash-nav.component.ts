import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationModel, User } from 'src/models';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, DRIVER, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-dash-nav',
  templateUrl: './dash-nav.component.html',
  styleUrls: ['./dash-nav.component.scss']
})
export class DashNavComponent implements OnInit {
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
    this.user = null;
    this.accountService.updateUserState(null);
    this.uxService.hideHomeSideNav();
    this.router.navigate(['']);
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
          Url: '/admin/dashboard/edit-user-profile'
        },

        {
          Label: 'Dashboard',
          ImageUrl: `assets/images/profle/menu-orders.png`,
          Url: '/admin/dashboard'
        }
      );
    }

    if (this.user && this.user.UserType !== DRIVER) {
      this.items.push(
        {
          Label: 'Go to home page',
          ImageUrl: `assets/images/profle/menu-orders.png`,
          Url: ''
        }
      );
    }





  }
  toggleMenu() {
    this.uxService.hideHomeSideNav();
  }
}
