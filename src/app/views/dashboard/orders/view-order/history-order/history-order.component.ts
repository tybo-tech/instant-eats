import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/models';

@Component({
  selector: 'app-history-order',
  templateUrl: './history-order.component.html',
  styleUrls: ['./history-order.component.scss']
})
export class HistoryOrderComponent implements OnInit {
  @Input() order :Order;
  constructor() { }

  ngOnInit(): void {
  }
  reOrder(){}
  goto(e){}
}
