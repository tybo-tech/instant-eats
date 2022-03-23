import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email } from 'src/models';
import { User } from 'src/models/user.model';
import { LocationModel, SliderWidgetModel } from 'src/models/UxModel.model';
import { EmailService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { CC_EMAILS, DRIVER, DRIVER_STATUSES, GENDER, SUPER, VIHICLES } from 'src/shared/constants';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {
  users: User[];
  user: User;
  userType: string;
  widgetItems: SliderWidgetModel[]
  primaryAction: string;
  showFilter = true
  heading: string;
  loading: boolean;
  error: any;
  DRIVER = DRIVER;
  VIHICLES = VIHICLES;
  GENDER = GENDER;
  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private uxService: UxService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.userType = r.type;
      this.primaryAction = `Add a ${this.userType}`;
      this.getUsers();
    });
  }

  ngOnInit() {

  }
  getUsers() {
    this.loading = true;
    this.userService.getAllUsersStync(this.userType).subscribe(data => {
      this.users = [];
      this.loading = false;
      this.widgetItems = [];
      if (data && data.length) {
        this.users = data.filter(x => x.UserType === this.userType);
        if (this.users && this.users.length) {
          data.forEach(item => {
            if (item.Dp == environment.DF_USER_LOGO) {
              item.Dp = 'assets/images/def-user.svg'
            }
            this.widgetItems.push({
              Id: `${item.UserId}`,
              Name: `${item.Name}`,
              Description: `${item.AddressLineHome}`,
              Link: `event`,
              Icon: item.Dp || 'assets/images/def-user.svg'
            })


          })
        }
      }
    })
  }


  OnItemSelected(item: SliderWidgetModel) {
    const user = this.users.find(x => x.UserId === item.Id);

    if (user) {
      this.user = user;
      this.heading = `Edit a ${this.userType}`

    }
  }
  onPrimaryActionEvent(event) {
    if (event) {
      this.user = {
        UserId: '',
        CompanyId: 'super',
        UserType: this.userType,
        Name: '',
        Surname: '',
        Email: '',
        PhoneNumber: '',
        Password: '',
        Dp: '',
        AddressLineHome: '',
        AddressUrlHome: '',
        CarReg: '',
        CarType: this.VIHICLES[0].Name,
        Gender: this.GENDER[0].Name,
        AddressLineWork: '',
        AddressUrlWork: '',
        CreateUserId: 'sign-up-shop',
        ModifyUserId: 'sign-up-shop',
        StatusId: '1',
        UserStatus: DRIVER_STATUSES.OFFLINE.Name,
        UserToken: ''
      };
      this.heading = `Add a ${this.userType}`
    }
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

  save() {
    this.uxService.showLoader();
    if (this.user.CreateDate && this.user.UserId.length > 0) {
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.uxService.showQuickMessage(`${this.userType} updated.`);
          this.getUsers();
          this.user = null;
          this.uxService.hideLoader()
        }
      })
    } else {
      this.userService.add(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.uxService.showQuickMessage(`${this.userType} created.`);
          this.user = null;
          this.uxService.hideLoader()

          const body = `
          We're glad to welcome  you. With Instant Easts, you can 
          Earn extra money working flexible hours. Start delivering today.`;
          this.sendEmail(data, body, data.Name, `${data.Email}, ${CC_EMAILS}`, 'Welcome to Instant Easts Drivers');
          this.getUsers();
        } else {
          this.error = data;

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
