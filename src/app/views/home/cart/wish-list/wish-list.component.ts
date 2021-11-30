import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { HomeTabModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { INTERRACTION_TYPE_LIKE } from 'src/shared/constants';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html',
  styleUrls: ['./wish-list.component.scss']
})
export class WishListComponent implements OnInit {
  user: User;
  interactions: Interaction[] = [];
  showAdd: boolean;
  productsInteractions: Interaction[];
  shopsInteractions: Interaction[];
  tab = 1;
  heading = 'view your wishlist.'

  TABS: HomeTabModel[] = [
    {
      Name: 'Products',
      Classes: ['active'],
    },
    {
      Name: `Shops`,
      Classes: [''],
    }
  ];


  pendingAction: boolean;
  currentTab: HomeTabModel = this.TABS[0];
  constructor(
    private router: Router,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
      if (this.pendingAction && this.user) {
        this.getInteractions()
      }
    });
    this.uxService.keepNavHistory(null);

    if (!this.user) {
      this.uxService.openTheQuickLogin();
      this.pendingAction = true;
    } else {
      this.getInteractions();
    }

  }
  back() {
    this.router.navigate(['']);
  }
  goto(url) {
    this.router.navigate(['home/sign-in']);
    this.router.navigate([url]);
  }

  getInteractions() {
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: '',
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractionsBySource(interactionSearchModel).subscribe(data => {
      this.pendingAction = false;
      if (data && data.length) {
        this.interactions = data;
        this.productsInteractions = data.filter(x => x.InteractionBody !== 'Follow');
        this.shopsInteractions = data.filter(x => x.InteractionBody === 'Follow');
        if (this.productsInteractions.length === 0 && this.shopsInteractions.length > 0) {
          this.currentTab = this.TABS[1];
          this.TABS.map(x => x.Classes = []);
          this.TABS[1].Classes = ['active'];
        }
      }
    });

  }
  select(interaction: Interaction) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/home/wishlist',
      BackTo: '/home/wishlist',
      ScrollToProduct: null
    });
    this.router.navigate(['shop/product', interaction.InteractionTargetId]);
  }

  onTab(item: HomeTabModel) {
    this.currentTab = item;
    this.TABS.map(x => x.Classes = []);
    item.Classes = ['active'];
  }
  login() {
    this.uxService.openTheQuickLogin();
  }
}
