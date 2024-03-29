import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { AccountService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrls: ['./dashboard-top-bar.component.scss']
})
export class DashboardTopBarComponent implements OnInit {
  showMenu: boolean;
  user: User;

  constructor(private accountService: AccountService, private router: Router,private uxService: UxService) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    });
    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })
  }
  menu() {
    this.showMenu = !this.showMenu;
  }

  profile(){
    this.router.navigate(['/admin/dashboard/edit-user-profile'])
  }
}
