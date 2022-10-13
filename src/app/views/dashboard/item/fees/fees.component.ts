import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { User } from 'src/models';
import { FeesModel, Item } from 'src/models/item.model';
import { AccountService } from 'src/services/account.service';
import { ItemService } from 'src/services/item.service';
import { UxService } from 'src/services/ux.service';
import { FEES_TABS, ITEM_TYPES } from 'src/shared/constants';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-fees',
  templateUrl: './fees.component.html',
  styleUrls: ['./fees.component.scss']
})
export class FeesComponent implements OnInit {
  FEES_TABS = FEES_TABS;
  user: User;

  // product | delivery |  order
  feeId: string;
  feesTypes = {
    product: { Name: 'product' },
    delivery: { Name: 'delivery' },
    order: { Name: 'order' },
  }
  items: Item[];
  item: Item;
  config: WebConfig;
  baseFee = 4;
  constructor(
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
  ) {

    this.activatedRoute.params.subscribe(r => {
      this.user = this.accountService.currentUserValue;
      this.feeId = r.id;
      this.getItems();
    });
  }

  ngOnInit(): void {
    this.config = getConfig(BASE);
  }
  getItem(itemType: string) {

  }
  getItems() {
    this.itemService.getItems(this.user.CompanyId, ITEM_TYPES.FEES.Name).subscribe(data => {
      if (data && data.length) {
        this.items = data;
        this.item = this.items.find(x => x.ItemType === this.feeId);
        if (this.item)
          this.loadFees(this.item)
      }
    })
  }
  loadFees(fee: Item) {
    if (!fee)
      return;

      console.log('fee', fee);
      
    const tab = this.FEES_TABS.find(x => x.Id === this.feeId);
    if (tab)
      this.goto(tab);

    fee.Fees = [];
    if (fee.Description)
      fee.Fees = JSON.parse(fee.Description);
    fee.Fees = this.newFee(fee.Fees, 'Add');
    console.log(fee);

  }
  goto(currentTab) {
    this.FEES_TABS.map(x => x.Class = []);
    currentTab.Class = ['active'];
    this.feeId = currentTab.Id;
    this.router.navigate([`admin/dashboard/fees/${currentTab.Id}`])
  }

  save() {
    if (this.item.CreateDate) {
      this.itemService.update(this.item).subscribe(data => {
        if (data && data.ItemId) {
          this.uxService.showQuickMessage(`Item was updated successfully`);
          this.item = data;
          this.loadFees(this.item);
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
  baseChanged(){
    this.itemService.update(this.item).subscribe(data=>{
      console.log(data);
      
    })
  }
}
