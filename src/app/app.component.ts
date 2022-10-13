import { AfterViewInit, ElementRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { BASE, environment } from 'src/environments/environment';
import { User } from 'src/models';
import { AccountService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { ITEM_TYPES } from 'src/shared/constants';
import { getConfig, WebConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  user: User;
  config: WebConfig;
  constructor(private elementRef: ElementRef, private swUpdate: SwUpdate, private swPush: SwPush, private accountService: AccountService, private router: Router, private itemService: ItemService) {
    this.updateClientapp();
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Received notification: ', event);
      const url = event.notification.data.url;
      window.open(url, '_blank');
    });
  }
  ngAfterViewInit(): void {
    this.config = getConfig(BASE);
    this.elementRef.nativeElement.style.setProperty('--primary-color', this.config.BackgroundColor);
    this.elementRef.nativeElement.style.setProperty('--primary-complementary', this.config.ComplementaryColor);
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


    this.getFees();

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


  getFees() {
    this.itemService.getItems('super', ITEM_TYPES.FEES.Name).subscribe(data => {
      if (data && data.length) {
        this.itemService.updateFeesState(data);
      }
    })
  }

}


//https://stackoverflow.com/questions/54138763/open-pwa-when-clicking-on-push-notification-handled-by-service-worker-ng7-andr