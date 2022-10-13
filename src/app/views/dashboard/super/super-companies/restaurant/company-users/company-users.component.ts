import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE, environment } from 'src/environments/environment';
import { User, Email } from 'src/models';
import { Company } from 'src/models/company.model';
import { SliderWidgetModel, LocationModel } from 'src/models/UxModel.model';
import { UserService, EmailService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CC_EMAILS } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-company-users',
  templateUrl: './company-users.component.html',
  styleUrls: ['./company-users.component.scss']
})
export class CompanyUsersComponent implements OnInit {
  users: User[];
  user: User;
  widgetItems: SliderWidgetModel[]
  showFilter = true
  heading: string;
  loading: boolean;
  primaryAction = 'Add an admin'
  companyId: any;
  company: Company;
  config: WebConfig = getConfig(BASE);
  noUsersFoundError: string;
  constructor(
    private userService: UserService,
    private router: Router,
    private emailService: EmailService,
    private uxService: UxService,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,


  ) {
    this.activatedRoute.params.subscribe(r => {
      this.companyId = r.id;
      this.getUsers();
    });
  }

  ngOnInit() {
    this.noUsersFoundError = `No users found in this ${this.config.WebCatergoryNameSingular} `
  }
  getUsers() {
    this.loading = true;
    this.userService.getUsersStync(this.companyId, ADMIN).subscribe(data => {
      this.users = data || [];
      this.loading = false;
      this.widgetItems = [];
      if (this.users && this.users.length) {
        data.forEach(item => {
          this.widgetItems.push({
            Id: `${item.UserId}`,
            Name: `${item.Name}`,
            Description: `${item.Email}`,
            Link: `event`,
            Icon: item.Dp || 'assets/images/def-user.svg'
          })


        })
      }
      this.companyService.getCompanyById(this.companyId).subscribe(data=>{
        this.company = data;
      })
    })
  }

  
  back() {
    this.router.navigate(['admin/dashboard/restaurant', this.companyId]);
  }


  OnItemSelected(item: SliderWidgetModel) {
    const user = this.users.find(x => x.UserId === item.Id);

    if (user) {
      this.user = user;
      this.heading = `Edit user`

    }
  }
  onPrimaryActionEvent(event) {
    if (event) {
      this.user = {
        UserId: '',
        CompanyId: this.companyId,
        UserType: ADMIN,
        Name: '',
        Surname: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Dp: '',
        AddressLineHome: '',
        AddressUrlHome: '',
        AddressLineWork: '',
        AddressUrlWork: '',
        CreateUserId: 'sign-up-shop',
        ModifyUserId: 'sign-up-shop',
        StatusId: '1',
        UserToken: ''
      };
      this.heading = `Add an admin`
    }
  }


  save() {
    this.loading = true;
    if (this.user.CreateDate && this.user.UserId.length > 0) {
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.uxService.showQuickMessage(`${ADMIN} updated.`);
          this.getUsers();
          this.user = null;
        }
      })
    } else {
      this.userService.add(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.uxService.showQuickMessage(`${ADMIN} created.`);
          this.user = null;

          const body = `
          We're glad to welcome  you. With Instant Easts, you can 
          Earn extra money working flexible hours. Start delivering today.`;
          this.sendEmail(data, body, data.Name, `${data.Email}, ${CC_EMAILS}`, 'Welcome to Instant Easts Drivers');
          this.getUsers();
        }
      })
    }
  }

  onImageChangedEvent(url) {
    if (this.user) {
      this.user.Dp = url;
    }
  }

  onAdressEvent(event: LocationModel) {
    console.log(event);
    if (event) {
      this.user.Latitude = event.lat;
      this.user.Longitude = event.lng;
      this.user.AddressLineHome = event.addressLine;
    }
  }

  sendEmail(user: User, data, companyName: string, email: string, sub: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/home/change-password/${user.UserToken}`,
      LinkLabel: 'Reset my password'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

}
