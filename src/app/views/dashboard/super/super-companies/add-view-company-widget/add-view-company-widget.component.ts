import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { User } from 'src/models';
import { Company } from 'src/models/company.model';
import { LocationModel } from 'src/models/UxModel.model';
import { ProductService, AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { COMMISSION_MODES, COMPANY_TABS, DELIVERY_MODES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-add-view-company-widget',
  templateUrl: './add-view-company-widget.component.html',
  styleUrls: ['./add-view-company-widget.component.scss']
})
export class AddViewCompanyWidgetComponent implements OnInit {
  company: Company;
  DELIVERY_MODES = DELIVERY_MODES;
  COMMISSION_MODES = COMMISSION_MODES;
  user: User;
  companyId: any;
  addEditCompanyHeading: string;
  COMPANY_TABS = COMPANY_TABS;
  tabId = 1;
  config: WebConfig = getConfig(BASE);
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
        this.addEditCompanyHeading = `Add new ${this.config.WebCatergoryNameSingular}`

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
          MaxDeliveryTime: '60',
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
  load() {
    this.companyService.getCompanyById(this.companyId).subscribe(data => {
      if (data && data.CompanyId) {
        this.company = data;
      }
    })
  }

  ngOnInit() {
    this.goto(COMPANY_TABS[0])
  }

  onImageChangedEvent(url) {
    if (this.company) {
      this.company.Dp = url;
    }
  }
  onImageBannerChangedEvent(url) {
    if (this.company) {
      this.company.Background = url;
    }
  }

  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.company.Latitude = event.lat;
      this.company.Longitude = event.lng;
      this.company.AddressLine = event.addressLine;
    }
  }

  back() {
    this.router.navigate([`admin/dashboard/restaurant`, this.companyId]);
  }

  save() {
    if (this.company.CreateDate && this.company.CompanyId.length > 5) {
      this.companyService.update(this.company).subscribe(data => {

        if (data && data.CompanyId) {
          this.company = data;
          this.uxService.showQuickMessage(`${this.config.WebCatergoryNameSingular} updated.`);
        }

      })
    } else {
      this.companyService.add(this.company).subscribe(data => {
        if (data && data.CompanyId) {
          this.company = data;
          this.uxService.showQuickMessage(`${this.config.WebCatergoryNameSingular} created.`);
        }


      })
    }
  }

  goto(currentTab) {
    this.COMPANY_TABS.map(x => x.Class = []);
    currentTab.Class = ['active'];
    this.tabId = currentTab.Id;
    // this.router.navigate([`admin/dashboard/invoices/${currentTab.Id}/${this.companyId}`])
  }
}
