import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { HomeTabModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-home-user-tabs',
  templateUrl: './home-user-tabs.component.html',
  styleUrls: ['./home-user-tabs.component.scss']
})
export class HomeUserTabsComponent implements OnInit {

  TABS = [
    {
      Name: 'Login',
      Classes: ['active'],
      Class: ['secondary'],
      Goto: '/home/profile',
      IsLoggingIn: true
    },
    {
      Name: `Sign Up`,
      Classes: [''],
      Class: ['secondary'],
      Goto: '/home/profile',
      IsLoggingIn: false
    },
    {
      Name: 'Start selling',
      Classes: [''],
      Class: ['primary'],
      Goto: 'home/hello-fashion-shop',
      IsLoggingIn: false
    }
  ];


  LOGGEDINTABS = [];


  pendingAction: boolean;
  user: User;
  pendingItem: any;
  heading: string;
  isLoggingIn: boolean;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.pendingAction = false;
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user) {
        if (this.pendingAction) {
          this.goto(this.pendingItem);
        }
        this.LOGGEDINTABS = [];
        this.LOGGEDINTABS.push(
          {
            Name: `Hi, ${this.user.Name.substring(0, 20)}`,
            Classes: [''],
            Class: ['primary', 'my-name'],
            Goto: 'home/profile',
          },
          {
            Name: `My shop`,
            Classes: [''],
            Class: ['primary'],
            Goto: 'myshop',
          }
        )
      }

    })

  }

  goto(item) {
    window.scroll(0, 0);
    if (item.Goto === 'myshop') {
      if (this.user && this.user.CompanyId) {
        this.TABS.map(x => x.Classes = []);
        // item.Class = ['active'];
        this.router.navigate([`/${this.user.CompanyId}`]);
      }
      if (this.user && !this.user.CompanyId) {
        this.TABS.map(x => x.Classes = []);
        // item.Class = ['active'];
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
        this.isLoggingIn = item.IsLoggingIn;
        this.heading = 'access your profile'
        return false;
      }
      this.TABS.map(x => x.Classes = []);
      // item.Class = ['active'];
      this.router.navigate([item.Goto]);
      return;
    }

    this.router.navigate([item.Goto]);
    this.TABS.map(x => x.Classes = []);
    // item.Class = ['active'];


  }


}
