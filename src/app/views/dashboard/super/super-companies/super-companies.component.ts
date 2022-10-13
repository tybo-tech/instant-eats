import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { BreadModel, LocationModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, ProductService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { COMMISSION_MODES, DELIVERY_MODES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-super-companies',
  templateUrl: './super-companies.component.html',
  styleUrls: ['./super-companies.component.scss']
})
export class SuperCompaniesComponent implements OnInit {
  config: WebConfig = getConfig(BASE);
  addEditCompanyHeading = `Add new ${this.config.WebCatergoryNameSingular}`;
  companies: Company[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  primaryAction = `Add ${this.config.WebCatergoryNameSingular}`
  company: Company;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  loading = true;
  DELIVERY_MODES = DELIVERY_MODES;

  constructor(
    private accountService: AccountService,
    private companyService: CompanyService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.load();

  }


  add() { }
  back() {
    this.router.navigate(['/admin/dashboard']);
  }
  
  onPrimaryActionEvent(event) {
    if (event) {
      this.router.navigate(['/admin/dashboard/company/add']);
    }
  }

  load() {
    this.companyService.getSuperCompanies().subscribe(data => {
      this.companies = data;
      this.loading = false;
      this.heading = `All companies`;
      this.usersItems = [];
      this.companies.forEach(item => {
        this.usersItems.push({
          Id: `${item.CompanyId}`,
          Name: `${item.Name}`,
          Description: `${item.AddressLine && item.AddressLine.substring(0, 33) || 'No Address.'}... `,
          Link: `/admin/dashboard/restaurant/${item.CompanyId}`,
          Icon: item.Dp,
          ShowDelete: true,
          ConfirmDelete: false,
        })


      });

      // this.OnItemSelected(this.usersItems[0])
    });
  }

  deleteEvent(item: SliderWidgetModel) {
    if (item.Id) {
      const q = `DELETE FROM company WHERE CompanyId = '${item.Id}'`;
      this.companyService.QueryDelete(q).subscribe(data=>{
        this.load()
        this.uxService.showQuickMessage(`Company deleted successfully`);
      })
    }
  }
}
