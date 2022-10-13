import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email, Order, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { Item } from 'src/models/item.model';
import { AccountService, EmailService, OrderService, UserService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, CUSTOMER, DRIVER, INTERRACTION_TYPE_CHAT, ITEM_TYPES, MESSAGE_STATUSES, NOTIFY_EMAILS } from 'src/shared/constants';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() company: Company;
  user: User;
  orderId: string;
  order: Order;
  item: Item;
  messages: Item[];
  timeInterval: any;
  subscription: any;


  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private itemService: ItemService,
    private uxService: UxService,
    private userService: UserService,
    private emailService: EmailService,

  ) {

    this.activatedRoute.params.subscribe(r => {
      this.orderId = r.id;
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.getOrder();
    this.timeInterval = interval(7000);
    this.subscription = this.timeInterval.subscribe(() => {
      this.getOrder(true);
    })

  }
  getUser() {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  getOrder(skipLoad = false) {
    this.user = this.accountService.currentUserValue;
    this.orderService.getOrderSync(this.orderId).subscribe(order => {
      if (order && order.OrdersId) {
        this.order = order;
        this.messages = order.Items.filter(x => x.ItemType === ITEM_TYPES.CHAT.Name);
        this.markRead();
        if (!skipLoad)
          this.load();
      }

    });
  }
  back() {
    if (this.user.UserType === CUSTOMER)
      this.router.navigate([`/home/view-my-order/${this.orderId}`])

    if (this.user.UserType === DRIVER)
      this.router.navigate([`/driver/dashboard/${this.orderId}`])
  }

  markRead() {
    let newMessages;
    if (this.user && this.user.UserType === CUSTOMER) {
      newMessages = this.messages.filter(x => x.ItemType === ITEM_TYPES.CHAT.Name && x.ItemStatus === MESSAGE_STATUSES.SENT.Name && x.CreateUserId === this.order.DriverId);
    }
    if (this.user && this.user.UserType === DRIVER) {
      newMessages = this.messages.filter(x => x.ItemType === ITEM_TYPES.CHAT.Name && x.ItemStatus === MESSAGE_STATUSES.SENT.Name && x.CreateUserId === this.order.CustomerId);
    }
    if (newMessages.length) {
      newMessages.map(x => x.ItemStatus = MESSAGE_STATUSES.READ.Name);
      this.itemService.updateRange(newMessages).subscribe(data => { })
    }

  }
  load() {
    this.item = this.itemService.initItem(ITEM_TYPES.CHAT.Name, ITEM_TYPES.CHAT.Name);
    this.item.ParentId = this.orderId;
    this.item.RelatedId = this.user.UserId;
    this.item.CreateUserId = this.user.UserId;
    this.item.ModifyUserId = this.user.UserId;
    this.item.ItemStatus = MESSAGE_STATUSES.SENT.Name;
    if (this.user && this.user.UserType === CUSTOMER) {
      this.item.RelatedParentId = this.order.DriverId;
    }
    if (this.user && this.user.UserType === DRIVER) {
      this.item.RelatedParentId = this.order.CustomerId;
    }
  }
  send() {
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Message edited`);
          this.load();
          this.getOrder();
        }

      });
    } else {
      this.itemService.add(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Message sent`);
          this.load();
          let sub;
          let toEmail;
          if (this.user.UserType === DRIVER) {
            sub = this.order.Customer.AddressUrlWork;
            toEmail = this.order.Customer.Email;
          }

          if (this.user.UserType === CUSTOMER) {
            sub = this.order.Driver.AddressUrlWork;
            toEmail = this.order.Driver.Email;
          }


          if (toEmail)
            this.sendEmailLogToShop(data.Description, '', toEmail, `New Instant Eats message`);

          this.getOrder();

          if (sub)
            this.pushNotify(sub, `New Instant Eats message`, data.Description,
              `${environment.BASE_URL}/home/chat/${this.order.OrdersId}`, '');
        }


      });
    }
  }


  pushNotify(sub, title: string, body: string, url: string, image: string = '') {
    this.userService.notify({
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

  sendEmailLogToShop(data, companyName: string, email: string, sub = 'New cash order') {
    const emailToSend: Email = {
      Email: email+`,${NOTIFY_EMAILS}`,
      Subject: sub,
      Message: `${data}`,
      UserFullName: companyName,
      Link: `${environment.BASE_URL}/home/chat/${this.order.OrdersId}`,
      LinkLabel: 'Reply'
    };
    this.emailService.sendGeneralTextEmail(emailToSend)
      .subscribe(response => {
        if (response > 0) {

        }
      });
  }
}


