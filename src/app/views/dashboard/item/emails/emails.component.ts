import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { Email, User } from 'src/models';
import { Item, FeesModel } from 'src/models/item.model';
import { AccountService, EmailService, UploadService, UserService } from 'src/services';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { EMAILS_TEMPLATE, EMAILS_TABS, ITEM_TYPES } from 'src/shared/constants';
import { EmailHelper } from 'src/shared/EmailHelper';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent implements OnInit {

  EMAILS_TABS = EMAILS_TABS;
  user: User;
  feeId: string;
  items: Item[];
  item: Item;
  config: WebConfig;
  baseFee = 4;
  selectUser = false;
  chooseAll = false
  userType = 'Customer';
  customers: User[];
  selectedCustomers: User[];
  allCustomers: User[];
  noPhoneCustomers: User[];
  noAddressCustomers: User[];
  filter1: string;
  search: string;
  constructor(
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private uploadService: UploadService,
    private emailService: EmailService,
    private userService: UserService,


  ) {

    this.activatedRoute.params.subscribe(r => {
      this.user = this.accountService.currentUserValue;
      this.feeId = r.id;
      this.getItems();
    });
  }

  ngOnInit(): void {
    this.config = getConfig(BASE);
    this.item = this.itemService.initItem(EMAILS_TEMPLATE.TEMPLATE.Name, EMAILS_TEMPLATE.TEMPLATE.Name);
    console.log(this.item);
    this.getUsers();

  }
  filter1Changed() {
    if (this.filter1 === 'no-phone') {
      this.customers = this.noPhoneCustomers;
    }
    if (this.filter1 === 'all') {
      this.customers = this.allCustomers;
    }
  }
  getUsers() {
    this.userService.getAllUsersStync(this.userType).subscribe(data => {
      this.allCustomers = data || [];
      this.noPhoneCustomers = this.allCustomers.filter(x => !x.PhoneNumber);
      this.noAddressCustomers = data || [];
      this.customers = data || [];
      this.customers.map(x => x.Selected = false)
    })
  }
  public uploadFile = (files: FileList) => {
    if (files.length === 0) {
      return;
    }

    Array.from(files).forEach(file => {
      this.uploadService.resizeImage(file, null, null, null, null, null, this.item);

      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('name', `tybo.${file.name.split('.')[file.name.split('.').length - 1]}`); // file extention
      // this.uploadService.uploadFile(formData).subscribe(url => {
      //   this.customer.Dp = `${environment.API_URL}/api/upload/${url}`;
      // });

    });
  }


  send() {
    console.log(this.item);
    this.sendAltraEmail(this.item.AddressLine, this.item.Name, this.config.Email);


  }
  select() {
    this.selectedCustomers = this.customers.filter(x => x.Selected);
    this.selectUser = false;
    this.item.AddressLine = '';
    this.selectedCustomers.forEach(c => {
      this.item.AddressLine += c.Email + ','
    })

  }
  getItem(itemType: string) {

  }
  getItems() {
    this.itemService.getItems(this.user.CompanyId, EMAILS_TEMPLATE.TEMPLATE.Name).subscribe(data => {
      if (data && data.length) {
        this.item = data[0];
      } else {
        this.item = this.itemService.initItem(EMAILS_TEMPLATE.TEMPLATE.Name, EMAILS_TEMPLATE.TEMPLATE.Name);
      }
    })
  }

  goto(currentTab) {
    this.EMAILS_TABS.map(x => x.Class = []);
    currentTab.Class = ['active'];
    this.feeId = currentTab.Id;
    this.router.navigate([`admin/dashboard/fees/${currentTab.Id}`])
  }
  inputChanged(customer?: User) {
    if (customer)
      customer.Selected = !customer.Selected;
    if (!customer)
      this.customers.map(x => x.Selected = this.chooseAll)

  }
  save() {
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Item was updated successfully`);
          this.item = data;
        }

      });
    } else {
      this.itemService.add(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Item was created successfully`);
        }
      });
    }
  }
  onFeeEvent(e: FeesModel) {
    if (!e || !e.Fee || !e.Min || !e.Max)
      return;

    console.log('Fee event', this.item.Fees);
    this.item.Fees = this.item.Fees.filter(x => x.Min && x.Max && x.Fee);
    this.item.Description = JSON.stringify(this.item.Fees);
    this.save();

  }

  newFee(fees: FeesModel[], label) {
    fees.push({ Min: undefined, Max: undefined, Label: label, Fee: undefined });
    return fees;
  }

  back() {
    this.router.navigate(['admin/dashboard/restaurant', this.user.CompanyId]);
  }
  baseChanged() {
    this.itemService.update(this.item).subscribe(data => {
      console.log(data);

    })
  }
  sendAltraEmail(email: string, subjet: string, from: string) {
    if (!this.selectedCustomers || !this.selectedCustomers.length)
      return;

    const emails = [];
    this.selectedCustomers.forEach(em => {
      const emailToSend: Email = {
        Email: em.Email,
        Subject: subjet,
        Message: EmailHelper.getEmailBasicTemplate(this.item, this.config.Name, em.Name),
        From: from,
      };
      emails.push(emailToSend)
    })


    this.emailService.sendAltraGeneralTextEmailRange(emails)
      .subscribe(response => {
        if (response > 0) {
          this.item.AddressLine = '';
          this.save();
          this.uxService.showQuickMessage(`Email sent`);

        }
      });
  }
}
