import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Email, Order, Orderproduct, Product, User } from 'src/models';
import { AccountService, EmailService, OrderService, ProductService, UserService } from 'src/services';
import { CustomerService } from 'src/services/customer.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, NOTIFY_EMAILS, PENDINGORDERS } from 'src/shared/constants';


@Component({
  selector: 'app-shoping-succesful',
  templateUrl: './shoping-succesful.component.html',
  styleUrls: ['./shoping-succesful.component.scss']
})
export class ShopingSuccesfulComponent implements OnInit {
  order: Order;
  showDone: boolean;
  orderNo: string;
  user: User;
  products: Product[];
  OrdersId: string;
  orderId: any;
  canUpdate = true;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private emailService: EmailService,
    private userService: UserService,
    private customerService: CustomerService,
    private accountService: AccountService,
    private productService: ProductService,
    private uxService: UxService,
    private activatedRoute: ActivatedRoute

  ) {
    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
      if (this.orderId) {
        orderService.getOrderSync(this.orderId).subscribe(data => {
          if (data && data.OrdersId) {
            this.order = data;
            this.canUpdate = true;
            this.order.Status = 'Pending';
            // this.order.FulfillmentStatus = 'CASH ORDER PENDING';
            this.order.Paid = this.order.Total;
            this.order.Due = 0;
            this.order.StatusId = PENDINGORDERS;
            this.saveInvoice();
          }
        })
      }
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    // this.order = this.orderService.currentOrderValue;

    // if (this.order) {
    //   this.uxService.showLoader();
    //   this.order.Status = 'Pending';
    //   this.order.FulfillmentStatus = 'CASH ORDER PENDING';
    //   this.order.Paid = this.order.Total;
    //   this.order.Due = 0;

    //   this.productService.getProductsSync(this.order.CompanyId).subscribe(products => {
    //     this.products = products
    //   });
    //   if (this.order.Company && !this.order.Company.Email) {
    //     this.userService.getUsersStync(this.order.CompanyId, ADMIN).subscribe(users => {
    //       if (users && users.length) {
    //         this.order.Company.Email = users[0].Email;
    //         this.getOrders();
    //       }
    //     })
    //   } else {
    //     this.getOrders();
    //   }

    // }
  }

  getOrders() {
    this.orderService.getOrdersSync(this.order.CompanyId).subscribe(data => {

      if (data) {
        this.order.OrderNo = `INV00${data.length + 1}`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      } else {
        this.order.OrderNo = `INV001`;
        this.orderService.updateOrderState(this.order);
        this.checkCustomerProfileForCompany();
      }

    })
  }

  checkCustomerProfileForCompany() {
    this.customerService.getCustomerByEmailandCompanyIdSync(this.user.Email, this.order.CompanyId).subscribe(data => {
      if (data && data.CustomerId) {
        this.order.CustomerId = data.CustomerId;
        this.saveInvoice();
      } else {
        const newCustomerProfile = {
          CustomerId: '',
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
            this.saveInvoice();
          }
        });
      }
    });
  }
  saveInvoice() {
    if (!this.order.Shipping) {
      this.order.Shipping = '';
    }
    if (!this.order.ShippingPrice) {
      this.order.ShippingPrice = 0;
    }
    this.order.OrderSource = 'Online shop';
    this.order = this.orderService.estimateDelivery(this.order);
    this.save();
  }


  back() {
    this.router.navigate(['']);
  }
  track() {
    this.router.navigate(['home/view-my-order', this.OrdersId]);
  }
  sendEmailLogToShop(data, companyName: string, email: string) {
    const emailToSend: Email = {
      Email: email,
      Subject: 'New order placed & paid',
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

  onTravelTimeEvent(time: number) {
    if (!this.canUpdate)
      return;
    if (this.order.Shipping === 'Delivery') {
      if (this.order.EstimatedDeliveryDate) {
        const date = new Date(this.order.EstimatedDeliveryDate);
        const max = new Date(this.order.MaxDeliveryTime);

        this.order.EstimatedDeliveryDate = this.orderService.addMinutes(date, time);
        this.order.MaxDeliveryTime = this.orderService.addMinutes(max, time);
        this.save();
        this.canUpdate = false;
      }
    }
  }
  save() {
    this.orderService.update(this.order).subscribe(data => {
      if (data && data.OrdersId) {
        this.uxService.hideLoader();
        this.order = data;
        this.OrdersId = data.OrdersId
        this.showDone = true;
        this.orderNo = this.order.OrderNo;
        this.productService.adjustStockAfterSale(this.products, this.order);
        const body = `Congratulations you have received an order of R${this.order.Total}`;
        const customerEMail = `  Your order, is being processed.
                      Once your order is ready to be delivered, you'll receive 
                      an Email notification confirming your scheduled delivery
                       date.`;
        const company = this.order.Company;
        if (company && company.Email) {
          this.sendEmailLogToShop(body, company.Name || '', company.Email);
          // this.sendEmailLogToShop(customerEMail, this.order.CustomerName || '', this.order.CustomerEmail);
          this.sendEmailLogToShop(body, company.Name || '', NOTIFY_EMAILS);
        }
        this.orderService.updateOrderState(null);
        // this.router.navigate(['home/order-done', this.order.OrdersId]);
        this.showDone = true;

      }
    });
  }
}
