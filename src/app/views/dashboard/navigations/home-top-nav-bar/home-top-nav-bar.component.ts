import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/user.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-home-top-nav-bar',
  templateUrl: './home-top-nav-bar.component.html',
  styleUrls: ['./home-top-nav-bar.component.scss']
})
export class HomeTopNavBarComponent implements OnInit {

  showMenu: boolean;
  user: User;
  locationData: LocationModel;

  constructor(private accountService: AccountService, private uxService: UxService, private router: Router) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    });

    this.uxService.locationObservable.subscribe(data => {
      if (data) {
        data.formatedAddress = `${data.addressLine.substring(0, 18)}...`;
        this.locationData = data;
      }
    })
    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })
  }
  menu() {
    this.showMenu = !this.showMenu;
  }
  back() {
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      if (data && data.BackTo) {
        this.router.navigate([data.BackTo]);
      } else {
        this.router.navigate(['home/select-location']);
      }
    })
    this.showMenu = !this.showMenu;
  }

  goto(url) {
    this.router.navigate([url]);
  }
}
