import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/models/customer.model';
import { AccountService } from 'src/services/account.service';
import { CustomerService } from 'src/services/customer.service';
import { CUSTOMER } from 'src/shared/constants';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  showModal: boolean;
  showAddCustomer: boolean;
  showLoader: boolean;
  users: Customer[] = [];
  modalHeading = 'Add customer';
  user;
  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.customerService.customersListObservable.subscribe(data => {
      this.users = data;
    });
    this.customerService.getCustomers(this.user.CompanyId, CUSTOMER);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  view(user: Customer) {
    this.customerService.updateCustomerState(user);
    this.router.navigate(['admin/dashboard/customer', user.CustomerId]);
  }
  add() {
    this.router.navigate(['admin/dashboard/customer', 'add']);
  }
  back() {
    this.router.navigate(['admin/dashboard']);
  }

}
