import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BASE } from 'src/environments/environment';
import { Order, User } from 'src/models';
import { AppConfig } from 'src/models/appconfig';
import { Item } from 'src/models/item.model';
import { OrderService } from 'src/services';
import { AccountService } from 'src/services/account.service';
import { AppConfigService } from 'src/services/appconfigservice';
import { ORDER_STATUSES, REPORTS_TABS } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit, OnDestroy {
  REPORTS_TABS = REPORTS_TABS;
  reportId: any;
  user: User;
  items: Item[] = []
  fromDate: string;
  toDate: string;
  orders: Order[];
  commissions: CommissionModel[];
  ORDER_STATUSES = ORDER_STATUSES;
  // donalt

  doughnutData: any;

  chartOptions: any;

  subscription: Subscription;

  appconfig: AppConfig;
  config: WebConfig = getConfig(BASE);
  orderReport: any;
  report: any;
  seletedList: Order[];
  sales: number;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private configService: AppConfigService
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.user = this.accountService.currentUserValue;
      this.reportId = r.id;
      // this.getItems();
    });
  }

  ngOnInit(): void {
    this.user = this.accountService.currentUserValue;
    this.fromDate = this.formatDate(new Date());
    this.toDate = this.formatDate(new Date());
    this.getReports();

  }
  goto(currentTab) {
    this.REPORTS_TABS.map(x => x.Class = []);
    currentTab.Class = ['active'];
    this.reportId = currentTab.Id;
    this.router.navigate([`admin/dashboard/reports/${currentTab.Id}`])
  }

  back() {
    this.router.navigate(['admin/dashboard/restaurant', this.user.CompanyId]);
  }

  formatDate(date) {

    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  getReports() {
    if (!this.fromDate || !this.toDate) return;
    if (this.reportId === 'orders')
      this.getOdersReport();

  }

  getOdersReport() {
    this.orderService.select(
      `
    SELECT 
    orders.Id,
    orders.CreateDate,
    orders.OrdersId,
    orders.Total,
    orders.Status,
    orders.ShippingCommissionFee,
    orders.DriverShippingFee,
    orders.ItemsTotal,
    orders.DriverTip,
    orders.OrderCommissionFee,
    orders.ServiceFee,
    orders.CustomerName,
    company.Name as CompanyName
    FROM orders 
    LEFT JOIN company ON orders.CompanyId = company.CompanyId
    WHERE orders.Status IN 
    ('${ORDER_STATUSES[0]}','${ORDER_STATUSES[5]}', '${ORDER_STATUSES[2]}','${ORDER_STATUSES[3]}','${ORDER_STATUSES[4]}','${ORDER_STATUSES[6]}') 
    AND Date(orders.CreateDate) BETWEEN Date('${this.fromDate}') and Date('${this.toDate}')
`)
      .subscribe(data => {
        if (data && data.length) {
          this.orders = data;
          this.sales = 0;
          this.commissions = [];

          let driverCommision = 0;
          let restaurantFee = 0;
          let driverTip = 0;
          let productCommission = 0;
          let shippingCommissionFee = 0;
          let serviceFee = 0;
          this.orders.forEach(order => {
            this.sales += Number(order.Total);
            shippingCommissionFee += Number(order.ShippingCommissionFee);
            driverCommision += Number(order.DriverShippingFee);
            restaurantFee += Number(order.ItemsTotal);
            driverTip += Number(order.DriverTip);
            productCommission += Number(order.OrderCommissionFee);
            serviceFee += Number(order.ServiceFee);
          })

          this.commissions.push({ Name: 'Due to drivers', Amount: driverCommision });
          this.commissions.push({ Name: `Due to ${this.config.WebCatergoryNameSingular}`, Amount: restaurantFee });
          this.commissions.push({ Name: 'Driver Tips', Amount: driverTip });
          this.commissions.push({ Name: 'Product commissions', Amount: productCommission });
          this.commissions.push({ Name: 'Delivery commissions', Amount: shippingCommissionFee });
          this.commissions.push({ Name: 'Service Fee', Amount: serviceFee });
          this.orderReport = {};
          this.orderReport.PEN = 0;
          this.orderReport.PRE = 0;
          this.orderReport.RFP = 0;
          this.orderReport.TRN = 0;
          this.orderReport.DEL = 0;
          this.orderReport.CAN = 0;

          const PEN = this.orders.filter(x => x.Status === ORDER_STATUSES[0]);
          const PRE = this.orders.filter(x => x.Status === ORDER_STATUSES[2]);
          const RFP = this.orders.filter(x => x.Status === ORDER_STATUSES[3]);
          const TRN = this.orders.filter(x => x.Status === ORDER_STATUSES[4]);
          const DEL = this.orders.filter(x => x.Status === ORDER_STATUSES[5]);
          const CAN = this.orders.filter(x => x.Status === ORDER_STATUSES[6]);

          this.orderReport.COUNT_PEN = PEN.length;
          this.orderReport.COUNT_PRE = PRE.length;
          this.orderReport.COUNT_RFP = RFP.length;
          this.orderReport.COUNT_TRN = TRN.length;
          this.orderReport.COUNT_DEL = DEL.length;
          this.orderReport.COUNT_CAN = CAN.length;

          PEN.forEach(order => { this.orderReport.PEN += Number(order.Total); })
          PRE.forEach(order => { this.orderReport.PRE += Number(order.Total); })
          RFP.forEach(order => { this.orderReport.RFP += Number(order.Total); })
          TRN.forEach(order => { this.orderReport.TRN += Number(order.Total); })
          DEL.forEach(order => { this.orderReport.DEL += Number(order.Total); })
          CAN.forEach(order => { this.orderReport.CAN += Number(order.Total); })

          this.loadDoughnut
            (
              ['PEN', 'PRE', 'RFP', 'TRN', 'DEL', 'CAN'],
              [this.orderReport.PEN, this.orderReport.PRE, this.orderReport.RFP, this.orderReport.TRN, this.orderReport.DEL, this.orderReport.CAN],
              [
                "#ff9800",
                "#000000",
                "#F3BB1C",
                "#36A2EB",
                "#378d01",
                "#ff0000"
              ],
              [
                "#ff9800",
                "#000000",
                "#F3BB1C",
                "#36A2EB",
                "#378d01",
                "#ff0000"
              ]
            );
          // this.itemService.updateTimeOuts(requestedItems);
        }
      })
  }

  viewReport(report =  '') {
    this.seletedList = null;
    this.seletedList = this.orders.filter(x => x.Status === report);
    if (this.seletedList && this.seletedList.length) {
      this.report = report;
    }else{
      this.seletedList  = this.orders;
      this.report = 'Order list';
    }
  }
  
  loadDoughnut(labels: string[], data: number[], backgroundColor: string[], hoverBackgroundColor: string[]) {
    this.doughnutData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: backgroundColor,
          hoverBackgroundColor: hoverBackgroundColor
        }
      ]
    };

    this.appconfig = this.configService.config;
    this.updateChartOptions();
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.appconfig = config;
      this.updateChartOptions();
    });
  }

  getLightTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      }
    }
  }

  updateChartOptions() {
    this.chartOptions = this.appconfig && this.appconfig.dark ? this.getDarkTheme() : this.getLightTheme();
  }


  getDarkTheme() {
    return {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef'
          }
        }
      }
    }
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


export interface CommissionModel {
  Name: string;
  Amount: number;
}