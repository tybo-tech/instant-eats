import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { BreadModel, LocationModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { AccountService, ProductService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { COMMISSION_MODES, DELIVERY_MODES } from 'src/shared/constants';

@Component({
  selector: 'app-super-companies',
  templateUrl: './super-companies.component.html',
  styleUrls: ['./super-companies.component.scss']
})
export class SuperCompaniesComponent implements OnInit {
  addEditCompanyHeading = 'Add new restaurant';
  companies: Company[] = [];
  isAll = true;
  isCat;
  isSub;
  user: User;
  heading: string;
  primaryAction = 'Add restaurant'
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
      this.router.navigate(['/admin/dashboard/restaurant/add']);
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
          Icon: item.Dp
        })


      });

      // this.OnItemSelected(this.usersItems[0])
    });
  }


}
