import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';
import { OrderService } from 'src/services';

@Component({
  selector: 'app-checkout-tip',
  templateUrl: './checkout-tip.component.html',
  styleUrls: ['./checkout-tip.component.scss']
})
export class CheckoutTipComponent implements OnInit {

  @Input() order: Order;
  edit: boolean;
  tips = [
    { Name: '0', Unit: '%', Class: ['active'] },
    { Name: '5', Unit: '%' },
    { Name: '10', Unit: '%' },
    { Name: '25', Unit: '%' },
    { Name: '50', Unit: '%' },
  ]
  constructor(
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    if (this.order && !this.order.DriverTip) {
      this.order.DriverTip = 0;
      this.order.DriverPercentage = '0';
    } else if (this.order && this.order.DriverTip) {
      const item = this.tips.find(x => x.Name === this.order.DriverPercentage);
      if (item)
        this.select(item, true);
    }

  }
  select(item, skipSave = false) {
    if (item.Name === 'MORE') {
      return
    }

    this.order.DriverPercentage = item.Name;
    this.order.DriverTip = (Number(item.Name) / 100) * Number(this.order.ItemsTotal);
    this.order.DriverTip = Math.floor(this.order.DriverTip);
    this.tips.map(x => x.Class = []);
    item.Class = ['active'];
    this.order = this.orderService.calculateTotalOverdue(this.order);
    if (!skipSave)
      this.orderService.updateOrderState(this.order);
  }


}
