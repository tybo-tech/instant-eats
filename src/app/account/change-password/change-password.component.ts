import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/models';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { UserService, EmailService, AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';
import { ADMIN, SUPER, CUSTOMER, DRIVER } from 'src/shared/constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  userToken: any;
  user: User;
  navHistory: NavHistoryUX;
  error
  showLoader: boolean;
  hidePassword: boolean = true;
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private emailService: EmailService,
    private uxService: UxService,


  ) {

    this.activatedRoute.params.subscribe(r => {
      this.showLoader = true;

      accountService.getUserByToken({ Token: r.id }).subscribe(data => {
        this.showLoader = false;
        if (data && data.UserId) {
          this.user = data;
          this.user.Password = null;

        }
      });
    });
  }
  ngOnInit() {
    this.uxService.uxNavHistoryObservable.subscribe(data => {
      this.navHistory = data;
    })
  }


  back() {
    if (this.navHistory && this.navHistory.BackToAfterLogin) {
      this.router.navigate([this.navHistory.BackToAfterLogin]);
    } else {
      this.router.navigate(['']);
    }
  }


  save() {
    this.showLoader = true;
    if (this.user.CreateDate && this.user.UserId.length > 0) {
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.Login();
        }
      })
    }
  }


  Login() {
    this.accountService.login({ email: this.user.Email, password: this.user.Password }).subscribe(user => {
      this.showLoader = false;
      if (user && user.UserId) {
        this.error = '';
        this.accountService.updateUserState(user);
        if (user.UserType === ADMIN || user.UserType === SUPER || user.UserType === DRIVER) {
          this.router.navigate(['admin/dashboard']);
          return;
        }
     
        if (user.UserType === CUSTOMER) {
          this.router.navigate(['']);

          return;
        }
      }
      else {
        let err: any = user;
        this.error = err + '. , Or contact us if you did not get the mail.' || 'your email or password is incorrect';
      }
    });
  }
}
