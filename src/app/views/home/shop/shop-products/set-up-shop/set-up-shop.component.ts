import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, UploadService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-set-up-shop',
  templateUrl: './set-up-shop.component.html',
  styleUrls: ['./set-up-shop.component.scss']
})
export class SetUpShopComponent implements OnInit {
  company: Company;
  user: User;
  config: WebConfig = getConfig(BASE);
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
    private uploadService: UploadService,
    private accountService: AccountService,
    private uxService: UxService,
    private router: Router
  ) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    })
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
      StatusId: '1'
    };
    // this.save();
  }
  save() {
    this.company.Slug = this.getSlug();
    this.companyService.add(this.company).subscribe(data => {
      if (data && data.CompanyId) {
        this.user.UserType = ADMIN;
        this.user.CompanyId = data.CompanyId;
        this.user.Company = data;
        this.userService.updateUserSync(this.user).subscribe(updatedUser => {
          if (updatedUser && updatedUser.UserId) {
            this.accountService.updateUserState(this.user);
            this.uxService.showQuickMessage('Your shop was created successfully');
            this.router.navigate([`${this.user.Company.Slug}`]);
          }
        })
      }

    })
  }

  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, null, this.company)
    });
  }


  getSlug() {
    let slug = '';
    if (this.user) {
      slug = this.company.Name.trim().toLocaleLowerCase().split(' ').join('-');
    }
    const slugArray = slug.split('');
    let newSlug = '';
    slugArray.forEach(item => {
      if (item.match(/[a-z]/i)) {
        newSlug += `${item}`
      }

      if (item.match(/[0-9]/i)) {
        newSlug += `${item}`
      }

      if (item === '-') {
        newSlug += `-`
      }
    })

    return newSlug;
  }


  onAdressEvent(event: LocationModel) {
    if (event) {
      this.company.Longitude = event.lng;
      this.company.Latitude = event.lat;
      this.company.AddressLine = event.addressLine;
      console.log(event);
    }
    // this.uxService.updateLocationState(event);
  }
}
