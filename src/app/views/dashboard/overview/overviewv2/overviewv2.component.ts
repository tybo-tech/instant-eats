import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, Product, User } from 'src/models';
import { AdminStatModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ACTIVEORDERS, ADMIN, CUSTOMER, DRIVER, DRIVER_TABS, HISTORYORDERS, PENDINGORDERS, SUPER } from 'src/shared/constants';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-overviewv2',
  templateUrl: './overviewv2.component.html',
  styleUrls: ['./overviewv2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Overviewv2Component implements OnInit {
  products: Product[];
  allProducts: Product[];
  user: User;
  showAdd: boolean;
  companyLink = '';
  ADMIN = ADMIN;
  SUPER = SUPER;
  showMenu: boolean;
  superMenu: SliderWidgetModel[];
  adminStat: AdminStatModel;
  loading: boolean;
  zoom: number = 11;
  iconWidth = 4;
  lat;
  lng;

  DRIVER = DRIVER;

  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private companyService: CompanyService,
    private router: Router,
    private uxService: UxService,
    private userService: UserService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user || !this.user.Company) {
      this.router.navigate(['home/sign-in'])
      return;
    }
    if (this.user && this.user.UserType === ADMIN) {
      this.router.navigate([`/admin/dashboard/restaurant/${this.user.CompanyId}`])
      return;
    }

    this.getAdminStat();

  }
  getAdminStat() {
    this.loading = true;
    this.companyService.getAdminStat().subscribe(data => {
      this.loading = false;

      if (data && data.Customers) {
        this.adminStat = data;
        this.buidleActions();
      }

    })
  }

  goto(url) {
    this.router.navigate([`admin/dashboard/${url}`]);
  }
  menu() {
    this.showMenu = !this.showMenu;
  }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate(['admin/dashboard/product', product.ProductSlug || product.ProductId]);
  }
  gotoShop() {
    this.router.navigate([this.user.Company.Slug || this.user.Company.CompanyId]);
  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: this.companyLink,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Shop LinkCopied to clipboard.');
    }
  }


  buidleActions() {
    this.superMenu = [];
    if (this.user && this.user.UserType === SUPER) {
      this.superMenu.push(
        {
          Name: `Restaurants`,
          Description: `${this.adminStat.Restaurants} items`,
          Link: `admin/dashboard/restaurants`,
          Icon: `assets/images/icon-restaurant.svg`
        },
        {
          Name: `Categories`,
          Description: `${this.adminStat.Categories}  items`,
          Link: `admin/dashboard/categories`,
          Icon: `assets/images/icon-categories.svg`
        },
        {
          Name: `Variations`,
          Description: `${this.adminStat.Variations || 0}  items`,
          Link: `admin/dashboard/variations`,
          Icon: `assets/images/icons/variations.svg`
        },
        {
          Name: `Drivers`,
          Description: `${this.adminStat.Drivers}  drivers`,
          Link: `admin/dashboard/all-users/${DRIVER}`,
          Icon: `assets/images/icon-driver.svg`
        },
        // {
        //   Name: `Food Items`,
        //   Description: `${this.adminStat.Products}  items`,
        //   Link: `admin/dashboard/all-products`,
        //   Icon: `assets/images/icon.svg`
        // },
        {
          Name: `Pending Orders`,
          Description: `${this.adminStat.PendingOrders}  orders`,
          Link: `admin/dashboard/invoices/${PENDINGORDERS}/${this.user.CompanyId}`,
          Icon: `assets/images/icon-orders-pen.svg`
        },
        {
          Name: `Active Orders`,
          Description: `${this.adminStat.ActiveOrders}  orders`,
          Link: `admin/dashboard/invoices/${ACTIVEORDERS}/${this.user.CompanyId}`,
          Icon: `assets/images/icon-orders-his.svg`
        },

        {
          Name: `Delivered Orders`,
          Description: `${this.adminStat.HistoryOrders}  orders`,
          Link: `admin/dashboard/invoices/${HISTORYORDERS}/${this.user.CompanyId}`,
          Icon: `assets/images/icon-orders-done.svg`
        },

        {
          Name: `Promotions`,
          Description: `${this.adminStat.Promotions}  items`,
          Link: `admin/dashboard/promotions`,
          Icon: `assets/images/icon-orders-promos.svg`
        },

        {
          Name: `Customers`,
          Description: `${this.adminStat.Customers}  customers`,
          Link: `admin/dashboard/all-users/${CUSTOMER}`,
          Icon: `assets/images/def-user.svg`
        }



      )
    }
    if (this.user && this.user.UserType === ADMIN) {
      this.superMenu.push(
        {
          Name: `Food Items`,
          Description: `${this.adminStat.Products} items`,
          Link: `admin/dashboard/products`,
          Icon: `assets/images/icon.svg`
        },

      )
    }


    if (this.user && this.user.UserType === DRIVER) {
      this.superMenu.push(

        {
          Name: `Pending Deliveries`,
          Description: `${this.adminStat.PendingOrders}  items`,
          Link: `admin/dashboard/deliveries/${DRIVER_TABS[0].Name.toLowerCase()}`,
          Icon: `assets/images/icon-orders-pen.svg`
        },
        {
          Name: `Active Deliveries`,
          Description: `${this.adminStat.ActiveOrders}  items`,
          Link: `admin/dashboard/deliveries/${DRIVER_TABS[1].Name.toLowerCase()}`,
          Icon: `assets/images/icon-orders-his.svg`
        },
        {
          Name: `History`,
          Description: `${this.adminStat.HistoryOrders}  items`,
          Link: `admin/dashboard/deliveries/${DRIVER_TABS[2].Name.toLowerCase()}`,
          Icon: `assets/images/icon-orders-done.svg`
        },
        {
          Name: `Cancelled`,
          Description: `${this.adminStat.HistoryOrders}  items`,
          Link: `admin/dashboard/deliveries/${DRIVER_TABS[3].Name.toLowerCase()}`,
          Icon: `assets/images/icon-orders-done.svg`
        }
      )
    }

  }



  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }



}

