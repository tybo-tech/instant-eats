import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { User } from 'src/models/user.model';
import { AccountService } from 'src/services/account.service';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { INTERRACTION_TYPE_LIKE } from 'src/shared/constants';

@Component({
  selector: 'app-all-shops',
  templateUrl: './all-shops.component.html',
  styleUrls: ['./all-shops.component.scss']
})
export class AllShopsComponent implements OnInit {
  @Input() fromPage: string;
  shops: Company[];
  plusFours: Company[] = [];
  showLoader: boolean = true;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchString: string;
  user: User;
  interactions: Interaction[];
  interaction: Interaction;
  showAdd: boolean;
  liked: string = 'no';
  company: Company;
  heading = 'follow shops.'
  pendingActionLike: boolean;
  likeAction: string;

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private homeShopService: HomeShopService,
    private accountService: AccountService,
    private interactionService: InteractionService,
    private uxService: UxService,



  ) { }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
      this.getInteractions();
      if (this.pendingActionLike) {
        this.onLike(this.likeAction, this.company);
      }

    })
    // this.getInteractions();
  }
  back() {
    this.router.navigate(['']);
  }
  getAllComapnies() {
    this.companyService.companyListObservable.subscribe(data => {
      this.uxService.hideLoader();
      if (data && data.length) {
        this.shops = data.filter(x => Number(x.ProductsCount && x.ProductsCount.ProductsCount) > 0);
        this.plusFours = this.shops.filter(x => x.GeCategoryNames && x.GeCategoryNames.length >= 2);
        this.plusFours.forEach(item => {
          item.Interaction = this.interactions && this.interactions.find(x => x.InteractionTargetId === item.CompanyId);
          item.Liked = item.Interaction != null;
        })
      }
    });
    this.companyService.getSuperCompaniesAySync();
  }

  view(item: Company) {
    if (item) {
      // this.homeShopService.updatePageMovesIntroTrueFalse(true);
      if (this.fromPage === 'sell-with-us') {
        this.uxService.keepNavHistory({
          BackToAfterLogin: '/home/hello-fashion-shop',
          BackTo: '/home/hello-fashion-shop',
          ScrollToProduct: null
        });
      }
      this.router.navigate([item.Slug || item.CompanyId]);
    }

  }


  onLike(like: string, company: Company) {
    this.company = company;
    this.likeAction = like;
    if (!this.user) {
      this.uxService.openTheQuickLogin();
      this.pendingActionLike = true;
      return false;
    }
    this.liked = like;
    if (like === 'yes') {
      this.interaction = {
        InteractionId: "",
        InteractionType: "Like",
        InteractionSourceId: this.user.UserId,
        InteractionTargetId: this.company.CompanyId,
        TraceId: '1',
        InteractionBody: "Follow",
        Color: '',
        Size: '',
        Price: 0,
        Name: this.company.Name,
        Description: this.company.Description,
        InteractionStatus: "Valid",
        ImageUrl: this.company.Dp,
        SourceType: "",
        SourceName: this.user.Name,
        SourceDp: this.user.Dp,
        TargetType: "",
        TargetName: "",
        TargetDp: "",
        CreateUserId: this.user.UserId,
        ModifyUserId: this.user.UserId,
        StatusId: 1
      }

      this.interactionService.add(this.interaction).subscribe(data => {
        if (data && data.InteractionId) {
          company.Liked = true;
          this.getInteractions();
          this.pendingActionLike = false;
          this.uxService.showQuickMessage('Shop added to favorites.');
          this.getInteractionSync();

        }
      })
    }

    if (like === 'no' && company.Interaction && company.Interaction.InteractionId && company.Interaction.CreateDate) {
      this.interactionService.delete(company.Interaction.InteractionId).subscribe(data => {
        company.Liked = false;
        this.uxService.showQuickMessage('Shop removed from favorites.');
        this.getInteractionSync();
      });
    }


  }



  getInteractionSync() {
    if (!this.user) {
      return;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: '',
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractionsBySourceSync(interactionSearchModel);
  }
  getInteractions() {
    this.uxService.showLoader();
    if (!this.user) {
      this.getAllComapnies();
      this.interactions = [];
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: '',
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractionsBySource(interactionSearchModel).subscribe(data => {
      if (data) {
        const liked = data.find(x => x.InteractionType === 'Like');
        if (liked) {
          this.interactions = data || [];
          this.liked = 'yes';
        }
      }
      this.getAllComapnies();
    })
  }


}
