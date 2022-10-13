import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { fail } from 'assert';
import { interval, Subscription } from 'rxjs';
import { Order } from 'src/models';
import { User } from 'src/models/user.model';
import { LoaderUx } from 'src/models/UxModel.model';
import { AccountService } from 'src/services/account.service';
import { OrderService } from 'src/services/order.service';
import { SchedulerService } from 'src/services/scheduler.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedIndex = 3;
  user: User;
  message: string;
  loading: boolean
  loadingUx: LoaderUx;
  showMenu: boolean;
  showScrollUp: boolean;
  requestInterval: any;
  requestSubscription: Subscription;
  newOrderClicked: boolean;
  order: Order;
  constructor(
    private accountService: AccountService,
    private uxService: UxService,
    private orderService: OrderService,
    private schedulerService: SchedulerService,
    private router: Router,
  ) { }
  ngAfterViewInit(): void {
    this.getActiveOrders();
    this.requestInterval = interval(3000);
    this.requestSubscription = this.requestInterval.subscribe(() => {
      if (this.user && this.user.UserType === ADMIN)
        this.getActiveOrders()
    })
  }
  ngOnDestroy(): void {
    this.requestSubscription.unsubscribe();
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.uxService.uxMessagePopObservable.subscribe(data => {
      this.message = data;
      const id = setTimeout(() => {
        this.message = null;
      }, 10000);
    });
    this.uxService.uxLoadingPopObservable.subscribe(data => {

      const id = setTimeout(() => {
        this.loadingUx = data;
      }, 0);
    });

    this.uxService.uxHomeSideNavObservable.subscribe(data => {
      this.showMenu = data;
    })


  }

  getActiveOrders() {
    this.orderService.getActiveOrders(this.user.CompanyId).subscribe(data => {
      if (data && data.length) {
        this.order = data.find(x => x.Status === ORDER_STATUSES[0]);
        this.orderService.queDrivers(data);
      }
    })
  }
  // getOrders(companyId: string, orderStatus = 3) {
  //   this.orderService.getOrdersSync(companyId, orderStatus).subscribe(data => {
  //     if (data && data.length) {
  //       console.log(data[0]);
  //       this.order = data[0];

  //       if (!this.newOrderClicked)
  //         this.uxService.beep();
  //     }
  //   })
  // }
  onTabChanged(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }
  onlineYes() {
    this.newOrderClicked = false;
    this.uxService.beep();
  }


  totop() {
    window.scroll(0, 0);
  }
  goto(item) {
    this.router.navigate([`admin/dashboard/${item}`]);
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent($event) {
    this.uxService.updatePageYPositionState(window.pageYOffset);
    if (window.pageYOffset > 500) {
      this.showScrollUp = true;
    } else {
      this.showScrollUp = false;
    }
  }


  onOrderClicked(e) {
    console.log(e);
    this.order = e;

    if (this.order.Status === ORDER_STATUSES[0]) {
      this.newOrderClicked = true;
    }

    if (this.order.Status === ORDER_STATUSES[2]) {
      this.newOrderClicked = false;
    }

  }
}


