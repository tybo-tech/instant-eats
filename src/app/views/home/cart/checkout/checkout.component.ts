import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { config } from 'process';
import { BASE, environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Item } from 'src/models/item.model';
import { Shipping, SHIPPING_OPTIONS } from 'src/models/shipping.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, EmailService, OrderService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ItemService } from 'src/services/item.service';
import { ShippingService } from 'src/services/shipping.service';
import { UxService } from 'src/services/ux.service';
import { DRAFT_ORDERS, NOTIFY_EMAILS, ORDER_PAYMENT_STATUSES, PENDINGORDERS } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() errorMessage: string;
  rForm: FormGroup;
  user: User;
  order: Order;
  isGuest: boolean;
  companyId: string;
  productName = '';
  productDescription = '';
  config: WebConfig = getConfig(BASE);
  merchantId = this.config.MerchantId;
  merchantKey = this.config.MerchantKey;showCardConfirm: boolean;
;
  shopingSuccesfulUrl: string;
  paymentCallbackUrl: string;
  paymentCancelledUrl: string;
  shippings: Shipping[];
  showCashConfirm: boolean;
  locationData: LocationModel;
  showOnlinePayment: boolean;
  fees: Item[];

  constructor(
    private accountService: AccountService,
    // private shoppingService: ShoppingService,
    private router: Router,
    private orderService: OrderService,
    private uxService: UxService,
    private interactionService: InteractionService,
    private customerService: CustomerService,
    private emailService: EmailService,
    private userService: UserService,
    private itemService: ItemService
  ) {

  }
  ngOnInit(): void {

    this.uxService.locationObservable.subscribe(data => {
      this.locationData = data;
    })

    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      // alert('No rder data');
      this.back();
    }
    this.user = this.accountService.currentUserValue;
    this.interactionService.logHomePage(this.user, 'check out', JSON.stringify(this.order || ''), "ViewCheckoutPage");

    if (this.user && this.user.Latitude) {
      this.order.CustomerId = this.user.UserId;
      this.order.CustomerName = this.user.Name;
      this.order.CustomerSurname = this.user.Surname;
      this.order.CustomerEmail = this.user.Email;
      this.order.CustomerPhone = this.user.PhoneNumber;
      this.order.Latitude = this.user.Latitude;
      this.order.Longitude = this.user.Longitude;
      this.order.FullAddress = this.user.AddressLineHome;
      this.orderService.updateOrderState(this.order);
    }

    if (this.locationData && this.user && this.user.Latitude !== this.locationData.lat) {
      this.user.Latitude = this.locationData.lat;
      this.user.Longitude = this.locationData.lng;
      this.user.AddressLineHome = this.locationData.addressLine;
      this.userService.updateUserSync(this.user).subscribe(data => {
        if (data && data.UserId) {
          this.user = data;
          this.accountService.updateUserState(data);
        }

        this.order.CustomerId = this.user.UserId;
        this.order.CustomerName = this.user.Name;
        this.order.CustomerSurname = this.user.Surname;
        this.order.CustomerEmail = this.user.Email;
        this.order.CustomerPhone = this.user.PhoneNumber;
        this.order.Latitude = this.user.Latitude;
        this.order.Longitude = this.user.Longitude;
        this.order.FullAddress = this.user.AddressLineHome;
        this.orderService.updateOrderState(this.order);
      })

    }

    if (!this.order.CustomerId) {
      this.order.CustomerId = 'pending';

      this.orderService.updateOrderState(this.order);
      this.router.navigate(['home/sign-in']);
    }
    this.companyId = this.order.CompanyId;
    this.shopingSuccesfulUrl = `${environment.BASE_URL}/home/shopping-succesful/${this.companyId}`;
    this.paymentCancelledUrl = `${environment.BASE_URL}/home/payment-cancelled/${this.companyId}`;
    this.paymentCallbackUrl = `${environment.BASE_URL}/home/payment-callback`;
    this.productName = this.order.Orderproducts.map(x => x.ProductName).toString();
    this.productDescription = this.productName;
    if (this.productName.length > 100) {
      this.productName = this.productName.substring(0, 99);
    }
    if (this.productDescription.length > 255) {
      this.productDescription = this.productDescription.substring(0, 254);
    }
    this.laodShipping();

    this.itemService.feesObservable.subscribe(fees => {
      if (fees && fees.length) {
        this.fees = fees;
      }
    })
  }
  contineuAsGuest() {
    this.isGuest = true;
  }

  back() {
    if (this.order && this.order.CompanyId) {
      this.router.navigate([`/shop/cart`]);
      return;
    }
    this.router.navigate(['']);
  }
  goto(url) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/shop/checkout',
      BackTo: null,
      ScrollToProduct: null,
    });
    this.router.navigate([url]);
  }
  payments() {
    this.router.navigate(['at', this.companyId]);
  }

  laodShipping() {
    this.shippings = SHIPPING_OPTIONS;
    // this.shippingService.getShippingsSync(this.order && this.order.CompanyId).subscribe(data => {
    //   if (data && data.length) {
    //     this.shippings = data;
    //   } else {
    //     this.shippings = systemShippings;
    //   }
    // })
  }
  payOnline() {
    this.order.OrderSource = 'Online shop';
    this.order.EstimatedDeliveryDate = '';
    this.order.MaxDeliveryTime = '';
    this.order.PaymentMethod = 'Online';
    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);


    if (this.order.CreateDate && this.order.OrdersId) {
      this.orderService.update(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.shopingSuccesfulUrl = `${environment.BASE_URL}/home/shopping-succesful/${data.OrdersId}`;
          this.paymentCancelledUrl = `${environment.BASE_URL}/home/payment-cancelled/${data.OrdersId}`;

          this.showOnlinePayment = true;
          this.order = data;
          this.orderService.updateOrderState(this.order)
        }
      })
    } else {
      this.order.Status = 'Draft';
      this.order.FulfillmentStatus = 'Placing Order';
      this.order.StatusId = DRAFT_ORDERS;

      this.orderService.create(this.order).subscribe(data => {
        if (data && data.OrdersId) {
          this.shopingSuccesfulUrl = `${environment.BASE_URL}/home/shopping-succesful/${data.OrdersId}`;
          this.paymentCancelledUrl = `${environment.BASE_URL}/home/payment-cancelled/${data.OrdersId}`;

          this.showOnlinePayment = true;
          this.order = data;
          this.orderService.updateOrderState(this.order)
        }
      })
    }


  }
  payCash() {
    this.showCashConfirm = true;
  }
  payCard() {
    this.showCardConfirm = true;
  }
  onCashConfirm() {
    this.showCashConfirm = false;
    this.order.OrderSource = 'Online shop';
    this.order.PaymentMethod = 'Cash';
    this.order.EstimatedDeliveryDate = '';
    this.order.MaxDeliveryTime = '';
    this.order = this.orderService.estimateDelivery(this.order);
    const emailbody = `New CASH ORDER order is in placed. <br>  <h3>R${this.order.Total}</h3>`;
    this.checkCustomerProfileForCompany(emailbody);
  }
  onCardConfirm() {
    this.showCashConfirm = false;
    this.order.OrderSource = 'Online shop';
    this.order.PaymentMethod = 'Card';
    this.order.EstimatedDeliveryDate = '';
    this.order.MaxDeliveryTime = '';
    this.order = this.orderService.estimateDelivery(this.order);
    const emailbody = `New CARD ORDER order is in placed. <br>  <h3>R${this.order.Total}</h3>`;
    this.checkCustomerProfileForCompany(emailbody);
  }


  saveInvoice(emailbody: string) {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }

    this.order = this.orderService.calculateTotalOverdue(this.order, this.fees);

    this.updateOrderAddress();
    this.order.OrderSource = 'Online shop';
    this.order.StatusId = PENDINGORDERS;
    this.order.Status = 'Pending';
    this.order.FulfillmentStatus = 'Order Placed';
    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();
        this.order = data;
        const company = this.order.Company;
        if (company) {

          this.sendEmailLogToShop(emailbody, company.Name || '', NOTIFY_EMAILS);
          if (company.PushId)
            this.userService.notify({
              subscribtion: JSON.parse(company.PushId), payload: {
                title: 'You received new order',
                body: 'Total of R' + this.order.ItemsTotal || '0.00',
                label1: 'View order',
                label2: '',
                image: this.orderService.getOneProductOrderImage(this.order),
                icon: `https://instanteats.co.za/api//api/upload/uploads/1646145462iio.jpg`,
                url1: `https://instanteats.co.za/admin/dashboard/invoices/3/${company.CompanyId}`,
                url2: ''
              }
            }).subscribe(e => {
              console.log(e);


            });
        }
        // this.orderService.updateOrderState(data);
        this.orderService.updateOrderState(null);

        this.router.navigate(['home/order-done', this.order.OrdersId]);
      }
    });

  }

  checkCustomerProfileForCompany(emailbody) {
    this.customerService.getCustomerByEmailandCompanyIdSync(this.user.Email, this.order.CompanyId).subscribe(data => {
      if (data && data.CustomerId) {
        this.order.CustomerId = data.CustomerId;
        this.saveInvoice(emailbody);
      } else {
        const newCustomerProfile = {
          CustomerId: this.user.UserId,
          CompanyId: this.order.CompanyId,
          CustomerType: 'Customer',
          Name: this.user.Name,
          Surname: this.user.Surname,
          Email: this.user.Email,
          PhoneNumber: this.user.PhoneNumber,
          Password: '',
          Dp: this.user.Dp,
          AddressLineHome: this.user.AddressLineHome,
          AddressUrlHome: this.user.AddressUrlHome,
          AddressLineWork: this.user.AddressLineWork,
          AddressUrlWork: this.user.AddressUrlWork,
          CreateUserId: this.user.UserId,
          ModifyUserId: this.user.UserId,
          StatusId: '1',
          UserToken: ''
        };
        this.customerService.add(newCustomerProfile).subscribe(newCust => {
          if (newCust && newCust.CustomerId) {
            this.order.CustomerId = newCust.CustomerId;
            this.saveInvoice(emailbody);
          }
        });
      }
    });
  }
  sendEmailLogToShop(data, companyName: string, email: string, sub = 'New cash order') {
    const emailToSend: Email = {
      Email: email,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/admin/dashboard/invoices/3/${this.order.CompanyId}`,
      LinkLabel: 'View Order'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }

  updateOrderAddress() {
    if (this.locationData && this.order) {
      this.order.AddressId = this.locationData.url || '';
    }

  }
}
