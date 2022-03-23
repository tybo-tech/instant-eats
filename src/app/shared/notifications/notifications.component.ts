import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { User } from 'src/models';
import { AccountService, UserService } from 'src/services';
import { VAPID_PUBLIC_KEY } from 'src/shared/constants';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  user: User;
  constructor(
    private swPush: SwPush,
    private accountService: AccountService,
    private userService: UserService,
    private applicationRef: ApplicationRef,
  ) { }

  ngOnInit(): void {
    this.accountService.user.subscribe(data => {
      if (data && data.UserId) {
        this.user = data;
        this.checkStatbale();
      }
    })
  }
  checkStatbale() {
    this.applicationRef.isStable.subscribe(isStable => {
      // this.alert(isStable)
      if (isStable) {
        this.subscribeToNotifications();
        // const timeInterval = interval(10000);
        // timeInterval.subscribe(() => {
        //   this.alert('checking....')
        // })
      }
    })
  }
  subscribeToNotifications() {

    if (!this.swPush.isEnabled || !this.user) {
      this.alert('No SW....')
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: VAPID_PUBLIC_KEY.publicKey
    })
      .then(sub => {
        const subb = JSON.stringify(sub);
        console.log(sub);
        this.alert("Sub 56 :" + subb)
        // this.alert(JSON.stringify(sub))
        if (subb && this.user) {
          this.user.AddressUrlWork = subb;
          this.userService.updateUserSync(this.user).subscribe(data => {
            if (data && data.UserId) {
              this.user = data;
              this.accountService.updateUserState(data);

            }
          })
        }


      })
      .catch(err => {
        this.alert("Sub 56 :" + JSON.stringify(err));
        this.checkExistingSub();
      });
  }

  checkExistingSub() {

    this.swPush.subscription.pipe(take(1))
      .subscribe(pushSubscription => {
        this.alert("Pusg sub 81 :" + JSON.stringify(pushSubscription))
        if (pushSubscription) {
          console.log('Active subscription', pushSubscription) // never gets called
          if (this.user && !this.user.AddressUrlWork) {
            this.user.AddressUrlWork = JSON.stringify(pushSubscription);
            this.userService.updateUserSync(this.user).subscribe(data => {
              // this.alert('user ap is back')
              if (data && data.UserId) {
                // this.alert('user returned')
                this.user = data;
                this.accountService.updateUserState(data);
              }
            })
          }
        }
        else {
          console.log('No active subscription');
        }
      }, err => { console.log("swpush.subscription error", err); })
  }

  alert(msg: string) {

  }
}
