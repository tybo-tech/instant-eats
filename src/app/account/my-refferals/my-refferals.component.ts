import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user.model';
import { AccountService, ProductService, UserService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-my-refferals',
  templateUrl: './my-refferals.component.html',
  styleUrls: ['./my-refferals.component.scss']
})
export class MyRefferalsComponent implements OnInit {

  referralCode: string;
  results: User[] = [];
  heading = 'like a product.'
  user: User;
  pendingAction: User;

  constructor(
    private productService: ProductService,
    private router: Router,
    private uxService: UxService,
    private accountService: AccountService,
    private userService: UserService,
  ) { }

  ngOnInit() {


    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.user && this.user.UserId) {
        this.getMyUsers(this.user.ReferralCode);
      }
      if (this.pendingAction && this.user && this.user.UserId) {
      }

    })
  }
  getMyUsers(referralCode: string) {
    if (referralCode) {
      this.referralCode =`${environment.BASE_URL}/home/invite/${this.user.ReferralCode}`;
      this.userService.getMyRefferals(referralCode).subscribe(data => {
        this.results = data || [];
      })
    } else {
      this.user.ReferralCode = this.generateSlug(this.user.Name);
      this.referralCode =`${environment.BASE_URL}/home/invite/${this.user.ReferralCode}`;
      this.userService.updateUserSync(this.user).subscribe(data=>{
        console.log(data);
        this.accountService.updateUserState(this.user);
      })
    }
  }





  generateSlug(name: string): string {
    name = name.trim();
    let slug = name.toLocaleLowerCase().split(' ').join('-');

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
      }
    })
    var theRandomNumber = Math.floor(Math.random() * 150) + 100;
    newSlug += `-${theRandomNumber}`
    return newSlug.toUpperCase();
  }
  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello!',
        text: 'Check out our shop.',
        url: this.referralCode,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Shop LinkCopied to clipboard.');
    }
  }

  login(){
    this.uxService.openTheQuickLogin();
  }
}
