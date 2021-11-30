import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, NavigationModel, User } from 'src/models';
import { AccountService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { ADMIN } from 'src/shared/constants';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { LocationModel } from 'src/models/UxModel.model';
import { UxService } from 'src/services/ux.service';

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


    if (!this.user) { }
    // this.locations.push(event)
    // if (this.locations.length === 2) {
    //  const distance = this.calcCrow(this.locations[0], this.locations[1])
    //  console.log(distance/1000);

    // }


  }

  back() {
    this.router.navigate([`home/welcome`]);
  }


}


