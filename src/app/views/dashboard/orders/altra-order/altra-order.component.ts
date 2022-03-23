import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order, User } from 'src/models';
import { Router } from '@angular/router';
import { OrderService } from 'src/services';
import { ACTIVEORDERS, HISTORYORDERS, ORDER_STATUSES } from 'src/shared/constants';

@Component({
  selector: 'app-altra-order',
  templateUrl: './altra-order.component.html',
  styleUrls: ['./altra-order.component.scss']
})
export class AltraOrderComponent implements OnInit {
  @Input() order: Order;
  @Input() user: User;
  @Output() orderEvent: EventEmitter<Order> = new EventEmitter<Order>();
  newOrderClicked: boolean;
  showAddCancel: boolean;
  showAdd: boolean;
  ORDER_STATUSES = ORDER_STATUSES;
  image: string;
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    if (this.order)
      this.image = this.orderService.getOneProductOrderImage(this.order);
  }
  orderClicked() {
    this.orderEvent.emit(this.order);
    this.newOrderClicked = true;
  }


  orderAction(action: string, order: Order) {
    this.order = order

    if (action === 'Cancel') {
      this.showAddCancel = true;
    }

    if (action === ORDER_STATUSES[2]) {
      this.showAdd = true;
      this.order.Status = ORDER_STATUSES[2];
      this.order.StatusId = ACTIVEORDERS;
      this.order.DeliveryMins = Number(this.order.Company.DeliveryTime || '15');
      if (this.order.DeliveryMins)
        this.calTime();

      this.order.StatusId = ACTIVEORDERS;

      this.updateOrder();
    }
    if (action === ORDER_STATUSES[3]) {
      this.order.Status = ORDER_STATUSES[3];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[3]) {
      this.order.Status = ORDER_STATUSES[3];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[4]) {
      this.order.Status = ORDER_STATUSES[4];
      this.order.StatusId = ACTIVEORDERS;
      this.updateOrder();
    }
    if (action === ORDER_STATUSES[5]) {
      this.order.Status = ORDER_STATUSES[5];
      this.order.StatusId = HISTORYORDERS;
      this.updateOrder();
    }
  }


  updateOrder() {
    this.showAdd = false;
    this.showAddCancel = false;

    if (this.order.Status === ORDER_STATUSES[2]) {
      this.order.AccetpTime = `${new Date()}`;
    }


    if (this.order.Status === ORDER_STATUSES[3]) {
      this.order.FinishTime = `${new Date()}`;
    }

    if (this.order.Status === ORDER_STATUSES[4]) {
      this.order.PickUpTime = `${new Date()}`;
    }


    if (this.order.Status === ORDER_STATUSES[5]) {
      this.order.DropOffTime = `${new Date()}`;
    }
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        // this.notify();

        if (this.order.Status === ORDER_STATUSES[2]) {
          this.router.navigate([`admin/dashboard/invoices/1/${this.order.CompanyId}`]);
          this.orderEvent.emit(this.order);
          this.newOrderClicked = false;
        }

      }
    });
  }

  calTime() {
    if (this.order) {
      this.order = this.orderService.estimateDelivery(this.order, this.order.DeliveryMins);
    }

  }




}
