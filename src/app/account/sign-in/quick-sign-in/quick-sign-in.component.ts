import { Component, Input, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Email, User, UserModel } from 'src/models';
import { AccountService, EmailService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { CUSTOMER, INVALID_USER_LOGIN, PASSWORD_INCORRECT, USER_ALREADY_EXISTS } from 'src/shared/constants';
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

@Component({
  selector: 'app-quick-sign-in',
  templateUrl: './quick-sign-in.component.html',
  styleUrls: ['./quick-sign-in.component.scss']
})
export class QuickSignInComponent implements OnInit {
  @Input() heading: string = 'continue';
  @Input() isLoggingIn = true;
  newUser: User;
  socialUser: SocialUser;
  loggedIn: boolean;
  modalImage: string;
  canShow: boolean;
  loginStep = 1;
  hidePassword = true;
  showUserExits: boolean;
  wrongPassword: string;
  constructor(
    private authService: SocialAuthService,
    private uxService: UxService,
    private accountService: AccountService,
    private emailService: EmailService,

  ) { }

  ngOnInit() {
    this.canShow = false;
    this.wrongPassword = undefined;
    this.showUserExits = undefined
    this.loginStep = 1;
    this.newUser = {
      UserId: '',
      CompanyId: '',
      UserType: CUSTOMER,
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
      StatusId: 1,
      UserToken: ''
    }


    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        const userModel: UserModel = {
          Dp: this.socialUser.photoUrl,
          Email: this.socialUser.email,
          CreateUserId: this.socialUser.provider,
          ModifyUserId: this.socialUser.provider,
          Name: this.socialUser.name,

          AddressUrlHome: '',
          AddressLineWork: '',
          AddressUrlWork: '',
          Surname: '',

          PhoneNumber: '',
          Password: `${Math.random() * 10}`,
          ImageUrl: '',
          UserType: CUSTOMER,
          AccessType: '',
          AccessStatus: '',
          AccessStartDate: '',
          AccessEndDate: '',

          AddressLineHome: '',
          StatusId: 1,
          Roles: [],

        };
        this.modalImage = this.socialUser.photoUrl
        this.socialLogin(userModel);

      }
    });

    this.uxService.showQuickLoginObservable.subscribe(data => {
      this.canShow = data;
    })
  }
  close() {
    this.uxService.closeQuickLogin();
  }
  register() {
    const userModel: UserModel = {
      Dp: '',
      Email: this.newUser.Email,
      CreateUserId: 'sign-up-web',
      ModifyUserId: 'sign-up-web',
      Name: this.newUser.Name,

      AddressUrlHome: '',
      AddressLineWork: '',
      AddressUrlWork: '',
      Surname: '',

      PhoneNumber: '',
      Password: this.newUser.Password,
      ImageUrl: '',
      UserType: CUSTOMER,
      AccessType: '',
      AccessStatus: '',
      AccessStartDate: '',
      AccessEndDate: '',

      AddressLineHome: '',
      StatusId: 1,
      Roles: [],

    };
    this.uxService.showLoader();
    this.accountService.register(userModel).subscribe(data => {
      const response: any = data;
      this.uxService.hideLoader();
      if (response && response.UserId) {
        this.accountService.updateUserState(data);
        this.back();
      }

      if (response === USER_ALREADY_EXISTS) {
        this.showUserExits = true;
        // this.login();
      }
    })
  }
  login() {
    this.uxService.showLoader();
    this.accountService.login({ email: this.newUser.Email, password: this.newUser.Password }).subscribe(data => {
      const response: any = data;
      this.uxService.hideLoader();
      if (response && response.UserId) {
        this.accountService.updateUserState(data);
        this.back();
      }

      if (response === INVALID_USER_LOGIN) {
        this.loginStep = 2;
      }

      if (response === PASSWORD_INCORRECT) {
        this.wrongPassword = PASSWORD_INCORRECT;
      }
    })
  }

  socialLogin(model?: UserModel) {
    this.uxService.showLoader();
    this.accountService.socialLogin(model).subscribe(user => {
      this.uxService.hideLoader();
      this.accountService.updateUserState(user);
      this.back();
    });
  }

  back() {
    this.ngOnInit();
    this.uxService.closeQuickLogin();
  }
  sendEmail(data: User) {
    const emailToSend: Email = {
      Email: data.Email,
      Subject: 'Instant Eats: Welcome & Activation',
      Message: '',
      Link: this.accountService.generateAccountActivationReturnLink(data.UserToken)
    };
    // this.showLoader = true;
    this.emailService.sendAccountActivationEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }


  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
