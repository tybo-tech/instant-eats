import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Order } from 'src/models';
import { Item } from 'src/models/item.model';
import { ACCEPT_REQUEST_SECONDS, DELIVERY_REQUEST_STATUSES, ITEM_TYPES } from 'src/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService {


  url: string;

  constructor(
    private http: HttpClient) {
    this.url = environment.API_URL;
  }


  add(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/add-item.php`, Item);
  }

  getItem(ItemId: string) {
    return this.http.get<Item>(`${this.url}/api/item/get-by-id.php?ItemId=${ItemId}`);
  }


}
