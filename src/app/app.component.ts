import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from 'src/models';
import { AccountService, UserService } from 'src/services';
import { VAPID_PUBLIC_KEY } from 'src/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: User;
  constructor(private swUpdate: SwUpdate, private swPush: SwPush, private accountService: AccountService, private router: Router, private userService: UserService) {
    this.updateClientapp();
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
  }
  ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
    this.accountService.user.subscribe(data => {
      if (data && data.UserId) {
        this.user = data;
      }
    });



  }



  updateClientapp() {
    if (!this.swUpdate.isEnabled) {
      console.log('Sw updated not enabled');
      return;
    }

    this.swUpdate.available.subscribe(data => {
      console.log('New update available.', data);
      if (confirm('There is a new app update, please confirm to allow the update right now')) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });


    this.swUpdate.activated.subscribe(data => {
      console.log('New update activated.', data);

    });
  }

}


//https://stackoverflow.com/questions/54138763/open-pwa-when-clicking-on-push-notification-handled-by-service-worker-ng7-andr