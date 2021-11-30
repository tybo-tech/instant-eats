import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
export class FloatingMenuComponent implements OnInit {
  user: User;
  pendingAction: boolean;
  heading = '';
  menus = [
    {
      Name: 'Home',
      Icon: 'roofing',
      Goto: '',
      Class: ['active']
    },
    {
      Name: 'Search',
      Icon: 'search',
      Goto: 'home/search',
      Class: []
    },
    {
      Name: 'My shop',
      Icon: 'storefront',
      Goto: 'myshop',
      Class: []
    },
    {
      Name: 'Profile',
      Icon: 'person_outline',
      Goto: '/home/profile',
      Class: []
    },



  ];
  pendingItem: any;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.pendingAction = false;
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.pendingAction) {
        this.goto(this.pendingItem);
      }
    })
  }

  goto(item) {

    window.scroll(0, 0);
    if (item.Goto === 'myshop') {
      if (this.user && this.user.CompanyId) {
        this.menus.map(x => x.Class = []);
        item.Class = ['active'];
        this.router.navigate([`/${this.user.CompanyId}`]);
      }
      if (this.user && !this.user.CompanyId) {
        this.menus.map(x => x.Class = []);
        item.Class = ['active'];
        this.router.navigate([`/${this.user.UserId}`]);
      }

      if (!this.user) {
        this.uxService.openTheQuickLogin();
        this.pendingAction = true;
        this.pendingItem = item;
        this.heading = 'access or setup your shop.'
        return false;
      }

      return;
    }
    if (item.Goto === '/home/profile') {
      if (!this.user) {
        this.uxService.openTheQuickLogin();
        this.pendingAction = true;
        this.pendingItem = item;
        this.heading = 'access your profile'
        return false;
      }
      this.menus.map(x => x.Class = []);
      item.Class = ['active'];
      this.router.navigate([item.Goto]);
      return;
    }

    this.router.navigate([item.Goto]);
    this.menus.map(x => x.Class = []);
    item.Class = ['active'];


  }

}
