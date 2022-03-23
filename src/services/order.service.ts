import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BASE, environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Order } from 'src/models/order.model';
import { ACCEPT_REQUEST_SECONDS, ADD_ORDER_URL, DELIVERY_REQUEST_STATUSES, GET_ORDERS_BY_USER_ID_URL, GET_ORDERS_URL, GET_ORDER_URL, ITEM_TYPES, ORDER_STATUSES, PRINT_URL, SEND_EMAIL_GENERAL_TEXT, UPDATE_ORDER_URL } from 'src/shared/constants';
import { Router } from '@angular/router';
import { Email, User } from 'src/models';
import { Item } from 'src/models/item.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {




  private OrderListBehaviorSubject: BehaviorSubject<Order[]>;
  public OrderListObservable: Observable<Order[]>;


  private PreparingOrderListBehaviorSubject: BehaviorSubject<Order[]>;
  public PreparingOrderListObservable: Observable<Order[]>;

  private OrderBehaviorSubject: BehaviorSubject<Order>;
  public OrderObservable: Observable<Order>;
  url: string;
  invoiceUrl = 'docs/48f1/invoice.php';

  constructor(
    private http: HttpClient, private router: Router
  ) {
    this.OrderListBehaviorSubject = new BehaviorSubject<Order[]>(JSON.parse(localStorage.getItem('OrdersList')) || []);
    this.PreparingOrderListBehaviorSubject = new BehaviorSubject<Order[]>(JSON.parse(localStorage.getItem('PreparingOrdersList')) || []);
    this.OrderBehaviorSubject = new BehaviorSubject<Order>(JSON.parse(localStorage.getItem('currentOrder')));

    this.OrderListObservable = this.OrderListBehaviorSubject.asObservable();
    this.PreparingOrderListObservable = this.PreparingOrderListBehaviorSubject.asObservable();
    this.OrderObservable = this.OrderBehaviorSubject.asObservable();
    this.url = environment.API_URL;
  }

  public get currentOrderValue(): Order {
    return this.OrderBehaviorSubject.value;
  }

  updateOrderListState(orders: Order[], status = null) {
    if (!status) {
      this.OrderListBehaviorSubject.next(orders);
      localStorage.setItem('OrdersList', JSON.stringify(orders));
      return;
    }

    if (status === ORDER_STATUSES[2]) {  // Preparing
      this.PreparingOrderListBehaviorSubject.next(orders);
      localStorage.setItem('PreparingOrdersList', JSON.stringify(orders));
      return;
    }

  }

  updateOrderState(order: Order) {
    this.OrderBehaviorSubject.next(order);
    localStorage.setItem('currentOrder', JSON.stringify(order));
  }

  assignDriverToOrder(order: Order, user: User): Order {
    order.DriverId = user.UserId;
    order.DriverName = user.Name;
    return order;
  }


  getOrders(companyId: string, statusId = 1) {
    this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}&StatusId=${statusId}`).subscribe(data => {
      this.updateOrderListState(data || []);
    });
  }

  getOrdersNearByUserByStatus(latitude: number, longitude: number, status: string = null, radius: number, userId: string) {
    return this.http.get<Order[]>(
      `${this.url}/api/orders/get-orders-near-by.php?Latitude=${latitude}&Longitude=${longitude}&Status=${status}&Radius=${radius}&UserId=${userId}`);
  }

  getOrdersSync(companyId: string, statusId = 1) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_URL}?CompanyId=${companyId}&StatusId=${statusId}`)
  }

  getActiveOrders(companyId: string) {
    return this.http.get<Order[]>(`${this.url}/api/orders/get-orders-by-company.php?CompanyId=${companyId}`)
  }
  getOrdersByUserIdSync(userId: string) {
    return this.http.get<Order[]>(`${this.url}/${GET_ORDERS_BY_USER_ID_URL}?UserId=${userId}`)
  }
  create(order: Order) {
    if (order && order.Orderproducts && order.Orderproducts.length) {
      order.Orderproducts.forEach(item => {
        if (item.OrderOptions) {
          item.OrderOptionsString = JSON.stringify(item.OrderOptions)
        }
      })
    }
    return this.http.post<Order>(`${this.url}/${ADD_ORDER_URL}`, order);
  }
  update(order: Order) {
    return this.http.post<Order>(`${this.url}/${UPDATE_ORDER_URL}`, order);
  }
  print(order: Order) {
    return this.http.post<Order>(`${this.url}/${PRINT_URL}`, order);
  }

  getOrder(OrderId: string) {
    this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`).subscribe(data => {
      if (data) {
        this.updateOrderState(data);
      }
    });
  }
  getOrderSync(OrderId: string) {
    return this.http.get<Order>(`${this.url}/${GET_ORDER_URL}?OrderId=${OrderId}`);
  }
  getOrdersWithNodrivers() {
    return this.http.get<Order>(`${this.url}/api/orders/get-order-to-assign-drivers.php`);
  }

  select(query: string) {
    return this.http.post<any[]>(`${this.url}/api/orders/select.php`, { query });
  }


  register(model: Order) {
    return this.http.post<Order>(`${this.url}/api/account/register.php`, model).pipe(map(Order => {
      if (Order) {
        return Order;
      }
    }));
  }

  getInvoiceURL(orderId: string) {
    return `${this.url}/api/${this.invoiceUrl}?guid=${orderId}`;
  }


  reOrder(order: Order) {
    order.OrdersId = '';
    order.EstimatedDeliveryDate = '';
    order.MaxDeliveryTime = '';
    order.CashCollected = 0;
    order.DriverTip = 0;
    order.DriverRating = '';
    order.DriverRatingNotes = '';
    order.ServiceFee = 0;
    order.DriverId = '';
    order.DriverName = '';
    order.DriverStatus = '';
    order.DriverRequestId = '';
    order.DriverRequestLastModified = '';
    order.Status = '';
    this.updateOrderState(order);
    this.router.navigate([`/shop/cart`])
  }
  estimateDelivery(order: Order, addmins = 0): Order {
    addmins = Number(addmins);
    if (order && order.Company) {
      const now = new Date();
      order.EstimatedDeliveryDate = this.addMinutes(now, Number(addmins || order.Company.DeliveryTime));
      // order.EstimatedDeliveryDate = `${est.getDate()}/${est.getMonth()}/${est.getFullYear()} ${est.getHours()}:${this.formtMins(est.getMinutes())}`;

      if (addmins >= Number(order.Company.MaxDeliveryTime)) {
        order.MaxDeliveryTime = this.addMinutes(now, Number(order.Company.MaxDeliveryTime) + addmins);
        // order.MaxDeliveryTime = `${max.getDate()}/${max.getMonth()}/${max.getFullYear()} ${max.getHours()}:${this.formtMins(max.getMinutes())}`;
      } else {
        order.MaxDeliveryTime = this.addMinutes(now, Number(order.Company.MaxDeliveryTime));
        // order.MaxDeliveryTime = `${max.getDate()}/${max.getMonth()}/${max.getFullYear()} ${max.getHours()}:${this.formtMins(max.getMinutes())}`;
      }


    }
    return order;
  }
  addMinutes(date: Date, minutes: number) {
    let d = new Date(date);
    if (minutes <= 60) {
      d.setMinutes(d.getMinutes() + minutes);
      return d;
    }
    const hours = Math.floor(minutes / 60); //round down
    const mins = minutes % 60;
    d.setMinutes(d.getMinutes() + mins);
    d.setHours(d.getHours() + hours);

    return d;
  }

  formtMins(m: number) {
    if (m > 9)
      return `${m}`;

    return `${m}0`;
  }



  calculateTotalOverdue(order: Order): Order {
    if (!order)
      return;

    order.Total = 0;
    order.ItemsTotal = 0;
    order.ServiceFee = 0;
    order.DriverTip = Number(order.DriverTip);
    order.Paid = order.Paid || 0
    order.ShippingPrice = order.ShippingPrice || 0;
    order.Orderproducts.forEach(line => {
      line.SubTotal = line.Quantity * Number(line.UnitPrice);
      order.ItemsTotal += (Number(line.UnitPrice) * Number(line.Quantity));
      order.CartItems += Number(line.Quantity);

    });

    order.ServiceFee = this.getServiceFee(Number(order.ItemsTotal));
    order.Total = Number(order.ItemsTotal) + Number(order.ShippingPrice) + order.DriverTip + order.ServiceFee;
    order.Due = Number(order.Total) - Number(order.Paid);
    return order;
  }
  getServiceFee(total: number): number {
    const fees = 0
    if (total <= 50) {
      return 5;
    }
    if (total > 50 && total <= 100) {
      return 7;
    }

    if (total > 100 && total <= 150) {
      return 11;
    }

    if (total > 150 && total <= 200) {
      return 15;
    }

    if (total > 200) {
      return 17;
    }

    return fees;
  }

  getOneProductOrderImage(order: Order): string {
    let image = '';
    if (order && order.Orderproducts && order.Orderproducts.length) {
      image = order.Orderproducts[0].FeaturedImageUrl;
    }
    return image
  }


  assignDrivers(drivers: User[], order: Order) {
    const requests = drivers.find(x => x.Items && x.Items.length && x.Items.find(i => i.ItemType === ITEM_TYPES.REQUEST.Name &&
      (i.ItemStatus === DELIVERY_REQUEST_STATUSES.REQUESTED.Name || i.ItemStatus === DELIVERY_REQUEST_STATUSES.ACCEPTED.Name)
    ));
    if (requests) {
      const user = requests.Items.find(i => i.ItemStatus === DELIVERY_REQUEST_STATUSES.REQUESTED.Name || i.ItemStatus === DELIVERY_REQUEST_STATUSES.ACCEPTED.Name)
      return;
    }
    const bestdriver = this.getBestDriver(drivers);
    if (bestdriver) {
      this.createArequest(bestdriver, order);
    }
    console.log('bestdriver', bestdriver);


    // drivers.forEach(driver => {
    //   const isBestDriver: boolean = this.isBestDriver(driver);
    //   if(isBestDriver){
    //     console.log('Best driver',driver);

    //     return;
    //   }
    // })



    // const requests = drivers.filter(x => x.Items && x.Items.length && x.Items.find(i => i.ItemType === ITEM_TYPES.REQUEST.Name));
    // console.log('requests', requests);
    // if (requests.length) {
    //   const approved = drivers.find(x => x.Items && x.Items.length && x.Items.find(i => i.ItemType === ITEM_TYPES.REQUEST.Name && i.ItemStatus === DELIVERY_REQUEST_STATUSES.ACCEPTED.Name));
    //   console.log('approved', approved);
    // }

    // if (!requests.length) {
    //   const bestdriver = this.getBestDriver(drivers);
    //   if (bestdriver) {
    //     this.createArequest(bestdriver, order);
    //   }
    //   console.log('bestdriver', bestdriver);

    // }

  }
  isBestDriver(driver: User): boolean {
    const requestes = driver.Items.find(x => x.ItemType === ITEM_TYPES.REQUEST.Name && x.ItemStatus === DELIVERY_REQUEST_STATUSES.REQUESTED.Name);
    const declined = driver.Items.find(x => x.ItemType === ITEM_TYPES.REQUEST.Name && x.ItemStatus === DELIVERY_REQUEST_STATUSES.DECLINED.Name);
    const timeOut = driver.Items.find(x => x.ItemType === ITEM_TYPES.REQUEST.Name && x.ItemStatus === DELIVERY_REQUEST_STATUSES.TIMEDEDOUT.Name);
    if (declined || requestes)
      return false;

    return true;
  }
  createArequest(driver: User, order: Order) {
    const item = this.initItem(ITEM_TYPES.REQUEST.Name, ITEM_TYPES.REQUEST.Name);
    item.ParentId = order.OrdersId;
    item.RelatedId = driver.UserId;
    item.ItemStatus = DELIVERY_REQUEST_STATUSES.REQUESTED.Name;
    this.addItem(item).subscribe(data => {

      if (data) {
        // Notify
        if (driver.AddressUrlWork) {
          this.pushNotify(driver.AddressUrlWork, `New delivery request`, `From ${order.Company.Name} to ${order.FullAddress}`,
            `${environment.BASE_URL}/driver/dashboard/${order.OrdersId}`, this.getOneProductOrderImage(order));
        }

        // Email
        const emailToSend: Email = {
          Email: driver.Email,
          Subject: `New delivery request`,
          Message: `From ${order.Company.Name} to ${order.FullAddress}`
        };

        this.sendGeneralTextEmail(emailToSend);
      }
    })

  }

  createRequestTimeOut(driver: User, order: Order) {
    const item = this.initItem(ITEM_TYPES.REQUEST.Name, ITEM_TYPES.REQUEST.Name);
    item.ParentId = order.OrdersId;
    item.RelatedId = driver.UserId;
    item.ItemStatus = DELIVERY_REQUEST_STATUSES.TIMEDEDOUT.Name;
    return this.addItem(item)

  }
  getBestDriver(drivers: User[]) {

    let driver = drivers.find(x => this.isBestDriver(x) && x.AddressUrlWork && x.PhoneNumber && x.Dp && x.CarReg);
    if (driver)
      return driver;

    if (!driver)
      driver = drivers.find(x => x => this.isBestDriver(x) && x.AddressUrlWork && x.PhoneNumber && x.CarReg);

    if (driver)
      return driver;


    if (!driver)
      driver = drivers.find(x => x => this.isBestDriver(x) && x.PhoneNumber && x.CarReg);

    if (driver)
      return driver;


  }
  pushNotify(sub, title: string, body: string, url: string, image: string = '') {
    this.notify({
      subscribtion: JSON.parse(sub), payload: {
        title: title,
        body: body,
        label1: '',
        label2: '',
        image: image,
        icon: `https://instanteats.co.za/api//api/upload/uploads/1646145462iio.jpg`,
        url1: url,
        url2: ''
      }
    }).subscribe(e => {
      console.log(e);


    });
  }
  notify(model) {
    return this.http.post<any>(`https://notification-app-hero-2.herokuapp.com/subscribe`, model).pipe(map(data => {
      if (data) {
        return data;
      }
    }));
  }

  addItem(Item: Item) {
    return this.http.post<Item>(`${this.url}/api/item/add-item.php`, Item);
  }


  initItem(catergory: string, type: string, name = ''): Item {
    return {
      ItemId: '',
      RelatedId: '',
      RelatedParentId: '',
      Name: name,
      ParentId: '',
      ItemType: type,
      CompanyId: BASE,
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

  sendGeneralTextEmail(data: Email) {
    this.http.post<any>(SEND_EMAIL_GENERAL_TEXT, data).subscribe(res => {
      console.log(data.Subject, res);

    })
  }

  calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2);
  }

  getSeconds(stringDate: string) {
    if (!stringDate)
      return null;
    let createDate;
    if (stringDate.replace(" ", "T").length === 2)
      createDate = new Date(stringDate.replace(" ", "T"));
    else
      createDate = new Date(stringDate);

    const startDate = new Date();
    var seconds = (startDate.getTime() - createDate.getTime()) / 1000;
    return Math.floor(seconds) + 1;
  }

  queDrivers(orders: Order[]) {
    if (!orders.length) {
      return;
    }
    orders.map(x => x.DriverCount = this.getSeconds(x.DriverRequestLastModified));


    orders.forEach(item => {
      console.log(item.DriverCount);
      
      if (item.DriverRequestLastModified && item.DriverStatus !== DELIVERY_REQUEST_STATUSES.ACCEPTED.Name && item.DriverCount > ACCEPT_REQUEST_SECONDS) {
        item.DriverRequestLastModified = '';
        item.DriverStatus = '';
        item.DriverRequestId = '';
        item.DriverCount = 1;
      }
    })


    const order = orders.find(x => !x.DriverRequestId);
    if (order && order.Drivers) {
      order.Drivers.map(x => x.LastDeliveryCount = this.getSeconds(x.LastDeliveryTime));
      const sortedByTime = order.Drivers.sort(function (a, b) {
        return b.LastDeliveryCount - a.LastDeliveryCount
      });

      if (sortedByTime.length) {
        const driver = sortedByTime[0];
        driver.DriverStatus = DELIVERY_REQUEST_STATUSES.REQUESTED.Name;
        driver.LastDeliveryTime = `${new Date()}`;

        order.Driver = driver;
        order.DriverStatus = DELIVERY_REQUEST_STATUSES.REQUESTED.Name;
        order.DriverRequestLastModified = `${new Date()}`;
        order.DriverRequestId = driver.UserId;
        this.update(order).subscribe(_order => {
          if (_order && _order.OrdersId) {
            if (driver.AddressUrlWork && driver.AddressUrlWork.includes("endpoint")) {
              console.log(driver.AddressUrlWork);
              
              this.pushNotify(driver.AddressUrlWork, `New delivery request`, `From ${order.Company.Name} to ${order.FullAddress}`,
                `${environment.BASE_URL}/driver/dashboard/${order.OrdersId}`, this.getOneProductOrderImage(order));
            }
    
            // Email
            const emailToSend: Email = {
              Email: driver.Email,
              Subject: `New delivery request`,
              Message: `From ${order.Company.Name} to ${order.FullAddress}`
            };
    
            this.sendGeneralTextEmail(emailToSend);
          }
        })

      }
      // console.log(sortedByTime);

      // sortedByTime.forEach(item => {
      //   console.log(item.Name, item.LastDeliveryTime, item.LastDeliveryCount);
      // })

    }
  }
}
