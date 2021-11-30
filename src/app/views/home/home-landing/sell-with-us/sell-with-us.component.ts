import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { Email, User, UserModel } from 'src/models';
import { Company } from 'src/models/company.model';
import { ModalModel } from 'src/models/modal.model';
import { AccountService, EmailService, UploadService, UserService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, IMAGE_DONE, SUPER } from 'src/shared/constants';

@Component({
  selector: 'app-sell-with-us',
  templateUrl: './sell-with-us.component.html',
  styleUrls: ['./sell-with-us.component.scss']
})
export class SellWithUsComponent implements OnInit {
  user: User;
  newUser: User;
  showForm: boolean;
  slide = 1;
  imageClass: string;
  imageIndex = 1;
  showAdd = true;
  isLoggingIn :boolean;
  fromPage = 'sell-with-us';
  signUpStep = 1;
  signUpHeading = 'Start your shop.';
  signUpSpan = ''
  socialUser: SocialUser;
  loggedIn: boolean;
  showLogin: boolean;
  modalModel: ModalModel = {
    heading: undefined,
    body: [],
    ctaLabel: 'Next',
    routeTo: 'admin/dashboard/upload-company-logo',
    img: undefined
  };
  modalImage: string;
  email: any;
  password: any;
  heading = 'set up your shop.'
  pendingShopSetUp: boolean;
  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: SocialAuthService,
    private interactionService: InteractionService,
    private uxService: UxService,

  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.accountService.user.subscribe(user => {
      this.user = user;
      if (this.user && this.user.UserId && this.pendingShopSetUp) {
        if (this.user && !this.user.CompanyId) {
          this.router.navigate([`/${this.user.UserId}`]);
        }
        if (this.user && this.user.CompanyId) {
          this.router.navigate([`/${this.user.CompanyId}`]);
        }
      }
    })
    this.interactionService.logHomePage(this.user, 'sell on tybo', "ViewSellWithUsPage");



    this.uxService.keepNavHistory(null);
  }
  registerShop() { }
  toggleShowForm() {
    this.showForm = !this.showForm;
  }
  done(isDoneIntro) {
    this.showForm = isDoneIntro;
  }
  add() {
    if (this.user
      && confirm(`You are currently logged on as ${this.user.Name},  click ok to LOG OUT?`)) {
      this.signOut();
      this.accountService.logout();
    }
    if (!this.user) {
      this.isLoggingIn = false;
      this.uxService.openTheQuickLogin();
      this.pendingShopSetUp = true;
      return false;
    }
  }
  login() {
    if (this.user
      && confirm(`You are currently logged on as ${this.user.Name},  click ok to LOG OUT?`)) {
      this.signOut();
      this.accountService.logout();
    }
    if (!this.user) {
      this.isLoggingIn = true;
      this.uxService.openTheQuickLogin();
      this.pendingShopSetUp = true;
      return false;
    }
  }


  changeSlide(number) {
    this.slide = number;
  }

  handleSwipe(direction) {
    this.imageClass = '';
    if (direction === 'left') {
      this.imageIndex++;
      this.imageClass = 'animation-next-slide';
      if (this.imageIndex > 3) {
        this.imageIndex = 1;
      }
      this.changeSlide(this.imageIndex);
    }
    if (direction === 'right') {
      this.imageIndex--;
      this.imageClass = 'animation-prev-slide';
      if (this.imageIndex < 1) {
        this.imageIndex = 3;
      }
      this.changeSlide(this.imageIndex);
    }

  }

  signOut(): void {
    this.authService.signOut();
  }




}
