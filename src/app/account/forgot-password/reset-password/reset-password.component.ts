import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenModel, ChangePasswordModel } from 'src/models/account.model';
import { AccountService } from 'src/services/account.service';
import { User } from 'src/models';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../forgot-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  token;
  rForm: FormGroup;
  hidePassword = true;
  error: string;
  showLoader: boolean;
  showModal: boolean;

user: User;
  showSuccess: boolean;
  constructor(
    private fb: FormBuilder,
    private routeTo: Router,
    private location: LocationStrategy,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.token = r.id;
      this.getUserByToken();

    });
   }

  ngOnInit() {
    this.rForm = this.fb.group({
      Email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])
      ),
      Password: [null, Validators.required],
      ConfirmPassword: [null, Validators.required]
    });
    const baseUrlMain: string = (this.location as any)._platformLocation.location.href;
    this.token = baseUrlMain.substring(baseUrlMain.indexOf('=') + 1);
    // verify user token
  }

  getUserByToken() {
    this.showLoader = true;
    if (this.token === undefined) {
      return
    }
    const tokenModel: TokenModel = { Token: this.token };
    this.accountService.getUserByToken(tokenModel).subscribe(data => {
      if (data) {
        this.showLoader = false;
        this.user = data;
      } else {

      }
    });
  }

  onSubmit(model: ChangePasswordModel) {
    this.error = undefined;
    this.showLoader = true;
    if (model.ConfirmPassword !== model.Password) {
      this.error = 'Password(s) must match!';
      this.showLoader = false;
      return;
    }
    this.accountService.changePassword(model).subscribe(data => {
      if (data) {
        // this.showLoader = false;
        // this.showModal = true;
        alert('Success,Please login with your new credentials');
        this.routeTo.navigate(['sign-in']);
      } else {
        // this.showLoader = false;
        // this.ctaModel.icon = 'assets/images/error.svg';
        // this.ctaModel.header = 'Oops, error';
        // this.ctaModel.message = 'Something went wrong, please try again later!';
        // this.showModal = true;
        alert('Error: 1003,Something went wrong, please try again later!');
        this.routeTo.navigate(['']);
      }
    });
  }
  save(){
    this.accountService.changePassword({Email: this.user.Email,Password: this.user.Password,ConfirmPassword: this.user.Password}).subscribe(data => {
      if (data) {
        this.showSuccess = true;
        this.routeTo.navigate(['/home/sign-in']);
      } else {
        alert('Error: 1003,Something went wrong, please try again later!');
        this.routeTo.navigate(['']);
      }
    });
  }
  login(){
    this.routeTo.navigate(['home/sign-in'])
  }
}
