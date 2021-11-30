import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Product } from 'src/models/product.model';
import { AdminStatModel, BreadModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';
import { DELIVERY_MODES, COMMISSION_MODES, ACTIVEORDERS, HISTORYORDERS, PENDINGORDERS, SUPER, ADMIN } from 'src/shared/constants';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  company: Company;
  companyId: any;
  products: Product[];
  tabsItems: BreadModel[];
  addEditCompanyHeading = 'View/Edit restaurant';
  user: User;
  loading = true;
  superMenu: SliderWidgetModel[];

  tabNumber = 1;
  adminStat: AdminStatModel;
  SUPER = SUPER
  ADMIN = ADMIN
  constructor(
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,


  ) {
    this.user = this.accountService.currentUserValue;
    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      if (this.companyId === 'add') {
        this.addEditCompanyHeading = 'Add new restaurant'

        this.company = {
          CompanyId: '',
          Name: '',
          Slug: '',
          Description: '',
          Dp: '',
          Background: '',
          Color: '',
          Phone: '',
          Email: '',
          DeliveryMode: DELIVERY_MODES[0],
          DeliveryTime: '30',
          MinimumOrder: '30',
          BaseDeliveryCharge: 20,
          DeliveryChargePerKM: 1.5,
          CommissionMode: COMMISSION_MODES[0],
          CommissionAmount: 20,
          DeliveryCommissionAmount: 0,
          AddressLine: '',
          Location: '',
          BankName: '',
          BankAccNo: '',
          BankAccHolder: '',
          BankBranch: '',
          IsDeleted: '',
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          CompanyType: 'Fashion',
          StatusId: '1',
          Radius: 25
        };
      } else {
        this.load();
      }
    });
  }

  ngOnInit() {

    this.tabsItems = [
      { Name: `<span class="material-icons">arrow_back_ios</span>Back`, Link: '', Class: ['back-btn'], Id: 'back-btn' },
      { Id: '1', Name: 'Details', Link: '', Class: ['active'] },
      { Id: '2', Name: 'Food items', Link: '', Class: [] },
      { Id: '3', Name: 'Admins', Link: '', Class: [] },
    ];

  }

  getAdminStat() {
    this.loading = true;
    this.companyService.getAdminStatByCompanyId(this.companyId).subscribe(data => {
      this.loading = false;

      if (data) {
        this.adminStat = data;
        this.buidleActions();
      }

    })
  }

  buidleActions() {
    this.superMenu = [];
    this.superMenu.push(
      {
        Name: `${this.company.Name}`,
        Description: `View restaurants info`,
        Link: `admin/dashboard/company/${this.company.CompanyId}`,
        Icon: `${this.company.Dp}`
      },
    
      {
        Name: `Food items`,
        Description: `${this.adminStat.Products || 0}  items`,
        Link: `admin/dashboard/products/${this.companyId}`,
        Icon: `assets/images/icon-food.png`
      },
    
    
      {
        Name: `Pending Orders`,
        Description: `${this.adminStat.PendingOrders}  orders`,
        Link: `admin/dashboard/invoices/${PENDINGORDERS}/${this.companyId}`,
        Icon: `assets/images/icon-orders-pen.svg`
      },
      {
        Name: `Active Orders`,
        Description: `${this.adminStat.ActiveOrders}  orders`,
        Link: `admin/dashboard/invoices/${ACTIVEORDERS}/${this.companyId}`,
        Icon: `assets/images/icon-orders-his.svg`
      },

      {
        Name: `Delivered Orders`,
        Description: `${this.adminStat.HistoryOrders}  orders`,
        Link: `admin/dashboard/invoices/${HISTORYORDERS}/${this.companyId}`,
        Icon: `assets/images/icon-orders-done.svg`
      },

      {
        Name: `Restaurants Admins`,
        Description: `${this.adminStat.Admins}  users`,
        Link: `admin/dashboard/company-users/${this.companyId}`,
        Icon: `assets/images/def-user.svg`
      },
      {
        Name: `Promotions`,
        Description: `${this.adminStat.Promotions}  items`,
        Link: `admin/dashboard/promotions`,
        Icon: `assets/images/icon-orders-promos.svg`
      }


    )


  }

  load() {
    this.companyService.getCompanyById(this.companyId).subscribe(data => {
      if (data && data.CompanyId) {
        this.company = data;
        this.getAdminStat();  
        // this.getProducts();
      }
    })
  }



  OnTabClickedEvent(breadModel: BreadModel) {
    if (!breadModel) { return }

    if (breadModel.Id === 'back-btn') {
      if (this.tabNumber == 2) {
        this.tabNumber = 1;
        return;
      }
      this.router.navigate(['/admin/dashboard/restaurants'])
      return;
    }
    this.tabNumber = Number(breadModel.Id);
  }



  back() {
    this.router.navigate(['/admin/dashboard/restaurants']);
  }
  
}
