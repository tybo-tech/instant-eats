import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE, environment } from 'src/environments/environment';
import { User } from 'src/models';
import { Item } from 'src/models/item.model';
import { ACCEPT_REQUEST_SECONDS, DELIVERY_REQUEST_STATUSES, ITEM_TYPES } from 'src/shared/constants';
import { AccountService } from '.';

@Injectable({
  providedIn: 'root'
})
export class ItemService {



  user: User;
  private pageListBehaviorSubject: BehaviorSubject<Item[]>;
  public pageListObservable: Observable<Item[]>;


  private ItemListBehaviorSubject: BehaviorSubject<Item[]>;
  public ItemListObservable: Observable<Item[]>;

  private feesBehaviorSubject: BehaviorSubject<Item[]>;
  public feesObservable: Observable<Item[]>;

  private ItemBehaviorSubject: BehaviorSubject<Item>;
  public ItemObservable: Observable<Item>;
  url: string;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.ItemListBehaviorSubject = new BehaviorSubject<Item[]>(JSON.parse(localStorage.getItem("ItemsList")) || []);
    this.pageListBehaviorSubject = new BehaviorSubject<Item[]>(JSON.parse(localStorage.getItem("PageList")) || []);
    this.feesBehaviorSubject = new BehaviorSubject<Item[]>(JSON.parse(localStorage.getItem("fees")) || []);
    this.ItemBehaviorSubject = new BehaviorSubject<Item>(null);

    this.ItemListObservable = this.ItemListBehaviorSubject.asObservable();
    this.pageListObservable = this.pageListBehaviorSubject.asObservable();
    this.ItemObservable = this.ItemBehaviorSubject.asObservable();
    this.feesObservable = this.feesBehaviorSubject.asObservable();

    this.url = environment.API_URL;
    this.user = accountService.currentUserValue;
  }

  public get currentItemValue(): Item {
    return this.ItemBehaviorSubject.value;
  }
  public get currentItemListValue(): Item[] {
    return this.ItemListBehaviorSubject.value;
  }
  public get currentPageListValue(): Item[] {
    return this.pageListBehaviorSubject.value;
  }

  updateItemsListState(items: Item[]) {
    this.ItemListBehaviorSubject.next(items);
    localStorage.setItem('ItemsList', JSON.stringify(items));
  }
  updatePageListState(items: Item[]) {
    this.pageListBehaviorSubject.next(items);
    localStorage.setItem('PageList', JSON.stringify(items));
  }
  updateFeesState(items: Item[]) {
    this.feesBehaviorSubject.next(items);
    localStorage.setItem('fees', JSON.stringify(items));
  }

  add(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/add-item.php`, Item);
  }
  addRange(items: Item[]) {
    return this.http.post<Item[]>(`${this.url}/api/item/add-item-range.php`, items);
  }
  getItems(companyId: string, itemCategory: string, showChildren = false) {
    return this.http.get<Item[]>(`${this.url}/api/item/get-items.php?CompanyId=${companyId}&ItemCategory=${itemCategory}&ShowChildren=${showChildren}`)
  }

  getItem(ItemId: string) {
    return this.http.get<Item>(`${this.url}/api/item/get-by-id.php?ItemId=${ItemId}`);
  }

  getImages(companyId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/api/item/get-images.php?CompanyId=${companyId}`)
  }
  update(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/update-item.php`, Item);
  }
  updateRange(items: Item[]) {
    return this.http.post<Item[]>(`${this.url}/api/item/update-items-range.php`, items);
  }
  delete(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/delete.php`, Item);
  }

  loadItems(companyId: string, itemCategory: string, showChildren = false) {
    return this.http.get<Item[]>(
      `${this.url}/api/item/get-items.php?CompanyId=${companyId}&ItemCategory=${itemCategory}&ShowChildren=${showChildren}`)
      .subscribe(data => {
        this.ItemListBehaviorSubject.next(data || []);
      })
  }


  initItem(catergory: string, type: string, name = ''): Item {
    return {
      ItemId: '',
      RelatedId: '',
      RelatedParentId: '',
      Name: name,
      ParentId: '',
      ItemType: type,
      CompanyId: this.user && this.user.CompanyId || BASE,
      Description: '',
      OrderingNo: 1,
      Price: 0,
      LimitValue: 0,
      OffLimitPrice: 0,
      ItemStatus: 'Active',
      ItemCode: '',
      ImageUrl: '',
      ItemPin: '',
      ItemCategory: catergory,
      ItemSubCategory: '',
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    }

  }

  updateTimeOuts(requestedItems: Item[]) {
    if (!requestedItems || !requestedItems.length)
      return;
    const expiredItems: Item[] = []
    requestedItems.forEach(data => {
      var seconds = this.getSeconds(data.CreateDate)
      if (seconds > ACCEPT_REQUEST_SECONDS) {
        expiredItems.push(data);
      }

      if (data) {

      }
    })

    if (expiredItems.length) {
      expiredItems.map(i => i.ItemStatus = DELIVERY_REQUEST_STATUSES.TIMEDEDOUT.Name);
      this.updateRange(expiredItems).subscribe(data => { })
    }
  }

  getSeconds(stringDate: string) {
    let createDate;
    if (stringDate.replace(" ", "T").length === 2)
      createDate = new Date(stringDate.replace(" ", "T"));
    else
      createDate = new Date(stringDate);
      
    const startDate = new Date();
    var seconds = (startDate.getTime() - createDate.getTime()) / 1000;
    return Math.floor(seconds) + 1;
  }
}
