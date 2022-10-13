import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';
import { Item } from 'src/models/item.model';
import { OrderService } from 'src/services';
import { ItemService } from 'src/services/item.service';

@Component({
  selector: 'app-checkout-tip',
  templateUrl: './checkout-tip.component.html',
  styleUrls: ['./checkout-tip.component.scss']
})
export class CheckoutTipComponent implements OnInit {

  @Input() order: Order;
  edit: boolean;
  fees: Item[];

  tips = [
    { Name: '0', Unit: '%', Class: ['active'] },
    { Name: '5', Unit: '%' },
    { Name: '10', Unit: '%' },
    { Name: '25', Unit: '%' },
    { Name: '50', Unit: '%' },
  ]
  constructor(
    private orderService: OrderService,    private itemService: ItemService,

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
    this.itemService.feesObservable.subscribe(fees => {
      if (fees && fees.length) {
      this.fees = fees;
      }
    })
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
    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);
    if (!skipSave)
      this.orderService.updateOrderState(this.order);
  }


}
