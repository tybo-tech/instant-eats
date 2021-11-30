import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Shipping, SHIPPING_OPTIONS } from 'src/models/shipping.model';
import { LocationModel } from 'src/models/UxModel.model';
import { AccountService, EmailService, OrderService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ShippingService } from 'src/services/shipping.service';
import { UxService } from 'src/services/ux.service';
import { NOTIFY_EMAILS, ORDER_PAYMENT_STATUSES, PENDINGORDERS } from 'src/shared/constants';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  rForm: FormGroup;
  user: User;
  order: Order;
  isGuest: boolean;
  companyId: string;
  productName = '';
  productDescription = '';
  merchantId = '17194710';
  merchantKey = 'tqcl4iesooa66';
  shopingSuccesfulUrl: string;
  paymentCallbackUrl: string;
  paymentCancelledUrl: string;
  shippings: Shipping[];
  showCashConfirm: boolean;
  locationData: LocationModel;
  constructor(
    private accountService: AccountService,
    // private shoppingService: ShoppingService,
    private router: Router,
    private orderService: OrderService,
    private uxService: UxService,
    private interactionService: InteractionService,
    private customerService: CustomerService,
    private emailService: EmailService




  ) {

  }
  ngOnInit(): void {



    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      // alert('No rder data');
      this.back();
    }
    this.user = this.accountService.currentUserValue;
    this.interactionService.logHomePage(this.user, 'check out', JSON.stringify(this.order || ''), "ViewCheckoutPage");
    this.uxService.locationObservable.subscribe(data => {
      this.locationData = data;

    })
    if (this.user && !this.order.CustomerId) {
      this.order.CustomerId = this.user.UserId;
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
  }
  contineuAsGuest() {
    this.isGuest = true;
  }

  back() {
    if (this.order && this.order.CompanyId) {
      this.router.navigate([`restaurant/${this.order.CompanyId}`]);
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

  payCash() {
    this.showCashConfirm = true;
  }
  onCashConfirm() {
    this.showCashConfirm = false;
    const emailbody = `New CASH ORDER order is in placed. <br>  <h3>R${this.order.Total}</h3>`;
    this.checkCustomerProfileForCompany(emailbody);
  }



  saveInvoice(emailbody: string) {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }
    this.updateOrderAddress();
    this.order.OrderSource = 'Online shop';
    this.order.EstimatedDeliveryDate = '';
    this.order.StatusId = PENDINGORDERS;
    this.order.Due = this.order.Total;
    this.order.Status = 'Pending';
    this.order.FulfillmentStatus = ORDER_PAYMENT_STATUSES[0].Name;
    this.orderService.create(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();
        this.order = data;
        const company = this.order.Company;
        if (company) {
          this.sendEmailLogToShop(emailbody, company.Name || '', NOTIFY_EMAILS);
          // this.sendEmailLogToShop(customerEMail, this.order.Customer.Name || '', this.order.Customer.Email);
          // this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
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
      Link: `${environment.BASE_URL}/private/order-details/${this.order.OrdersId}`,
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
