import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Order, Orderproduct, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Images } from 'src/models/images.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { Promotion } from 'src/models/promotion.model';
import { NavHistoryUX, BreadModel } from 'src/models/UxModel.model';
import { OrderService, AccountService, ProductService } from 'src/services';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { ORDER_TYPE_SALES, INTERRACTION_TYPE_LIKE, DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-product-quick-view',
  templateUrl: './product-quick-view.component.html',
  styleUrls: ['./product-quick-view.component.scss']
})
export class ProductQuickViewComponent implements OnInit {
  @Input() selectedProduct: Product;
  @Output() showProduct: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() checkoutOrShopMoreEvent: EventEmitter<string> = new EventEmitter<string>();

  product: Product;
  otherproducts: Product[] = [];
  tittle: string;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  modalHeading: string;
  orderProducts: Product[];
  sizes: ProductVariation;
  colors: ProductVariation;
  Total: number;
  customer: User;
  order: Order;
  company: Company;
  leavingShowWarning: boolean;
  htmlPreview: any;
  selectedOption: ProductVariationOption;
  imageIndex = 0;
  imageClass;
  fullLink: any;
  baseUrl = environment.BASE_URL;
  carttItems = 0;
  navHistory: NavHistoryUX;
  selectedQuantiy: number = 1;
  liked: string = 'no';
  heading = 'like a product.'

  interaction: Interaction;
  user: User;


  items: BreadModel[] = [
    {
      Name: 'Home',
      Link: ''
    },

  ];
  pendingActionLike: boolean;
  like: string;

  constructor(
    private homeShopService: HomeShopService,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private accountService: AccountService,
    private productService: ProductService,
    private uxService: UxService,
    private interactionService: InteractionService,


  ) {
  }

  ngOnInit() {
    this.loadScreen();
    this.accountService.user.subscribe(data => {
      this.user = data;
      this.getInteractions();
      if (this.pendingActionLike && this.user && this.user.UserId) {
        this.onLike(this.like);
      }

    })
  }

  loadScreen() {
    this.items = [];
    this.user = this.accountService.currentUserValue;
    if (this.selectedProduct) {
      this.productService.getProductSync(this.selectedProduct.ProductSlug).subscribe(data => {
        if (data) {
          this.product = data;
          this.interactionService.logProductPage(this.user, this.product);
          this.fullLink = `${this.baseUrl}/shop/product/${this.product.ProductSlug || this.product.ProductId}`;
          if (this.product) {
            this.sanitize();
            this.company = this.product.Company;
            this.tittle = `More from ${this.company.Name}`;
            // this.loadCategories();
            this.items.push(
              {
                Name: 'Home',
                Link: ``
              },
              {
                Name: this.company.Name.substr(0, 30),
                Link: `/${this.product.Company.Slug || this.product.Company.CompanyId}`
              },

              // {
              //   Name: this.product.CategoryName.substr(0,50),
              //   Link: `home/collections/picks`
              // },
              {
                Name: this.product.Name.substr(0, 50),
                Link: `shop/product/${this.product.ProductSlug || this.product.ProductId}`
              }

            )
            if (this.company && this.company.Promotions && this.company.Promotions.length) {
              const promo: Promotion = this.company.Promotions[0];
              if (promo.PromoType === DISCOUNT_TYPES[0]) {
                this.product.SalePrice = (Number(this.product.RegularPrice) * (Number(promo.DiscountValue) / 100));
                this.product.SalePrice = (Number(this.product.RegularPrice) - (Number(this.product.SalePrice)));
                this.product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
              }
              if (promo.PromoType === DISCOUNT_TYPES[1]) {
                (this.product.SalePrice = (Number(this.product.RegularPrice) - (Number(promo.DiscountValue))));
              }
  
              if (Number(this.product.SalePrice) < Number(this.product.RegularPrice)) {
                this.product.OnSale = true;
              }
  
            }
            this.sizes = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Size');
            this.colors = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Color');
            if (this.product.Images && this.product.Images.length) {
              this.product.AllImages = this.product.Images;
              this.product.Images = [];
              if (this.product.Images[0]) {
                this.product.Images[0].Class = ['active'];
                this.product.FeaturedImageUrl = this.product.Images[0].Url
              }


              if (this.colors && this.colors.ProductVariationOptions) {
                this.colors.ProductVariationOptions.forEach(item => {
                  item.Images = this.product.AllImages.filter(x => x.OptionId === item.Id);
                });
                this.colors.ProductVariationOptions = this.colors.ProductVariationOptions.filter(x => x.Images && x.Images.length > 0)
              }
            }

            if (this.colors && this.colors.ProductVariationOptions && this.colors.ProductVariationOptions.length) {
              this.colors.ProductVariationOptions = this.colors.ProductVariationOptions.filter(x => x.ShowOnline === 'show')
              this.selectOption(this.colors.ProductVariationOptions[0], 'Coulor');
            }
            if (this.sizes && this.sizes.ProductVariationOptions && this.sizes.ProductVariationOptions.length) {
              this.selectOption(this.sizes.ProductVariationOptions[0], 'Size');
            }
          }




          this.homeShopService.updatePageMovesIntroTrueFalse(false);
          this.order = this.orderService.currentOrderValue;
          if (!this.order) {
            this.order = {
              OrdersId: '',
              OrderNo: 'Shop',
              CompanyId: this.product.CompanyId,
              Company: this.company,
              CustomerId: '',
              AddressId: '',
              Notes: '',
              OrderType: ORDER_TYPE_SALES,
              Total: 0,
              Paid: 0,
              Due: 0,
              InvoiceDate: new Date(),
              DueDate: '',
              CreateUserId: 'shop',
              ModifyUserId: 'shop',
              Status: 'Not paid',
              StatusId: 1,
              Orderproducts: []
            }
            this.orderService.updateOrderState(this.order);
          }
          this.carttItems = this.order.Orderproducts && this.order.Orderproducts.length || 0;
          this.uxService.updateLoadingState({ Loading: false, Message: undefined });
          this.getInteractions();
        }
      })



    }
  }

  sanitize() {
    this.htmlPreview = this.sanitizer.bypassSecurityTrustHtml(this.product.Description);
  }


  ngOnChanges() {
    // this.updateTotalPrice(this.quantity);
  }
  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
    this.totalPrice = this.product.RegularPrice * quantity;
  }
  addCart(product: Product) {
    if (this.order && this.order.Orderproducts.length) {
      if (this.order.CompanyId !== product.CompanyId) {
        this.leavingShowWarning = true;
        return false;
      }

    }

    if (product && product.ProductId) {
      product.SelectedQuantiy = this.selectedQuantiy;
      const orderproduct = this.mapOrderproduct(product);
      this.order.Orderproducts.push(orderproduct);
      if (product.Company) {
        this.order.Company = product.Company;
      }
      this.order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.orderService.updateOrderState(this.order);
      this.modalHeading = `${product.Name} added to bag successfully`;
      this.cart();
    }
  }

  continueShopping() {
    this.orderService.updateOrderState(this.order);
    this.router.navigate(['']);
  }
  checkout() {
    this.router.navigate(['shop/checkout']);
  }

  onNavItemClicked(event) { }

  back() {
    this.showProduct.emit(false);
  }
  bookmark() { }



  mapOrderproduct(product: Product): Orderproduct {
    return {
      Id: '',
      OrderId: '',
      ProductId: product.ProductId,
      CompanyId: product.CompanyId,
      ProductName: product.Name,
      ProductType: 'Product',
      Colour: product.SelectedCoulor || '',
      Size: product.SelectedSize || '',
      Quantity: product.SelectedQuantiy || 1,
      SubTotal: product.SelectedQuantiy * Number(product.RegularPrice),
      UnitPrice: product.SalePrice || product.RegularPrice,
      FeaturedImageUrl: product.FeaturedImageUrl,
      CreateUserId: '',
      ModifyUserId: '',
      StatusId: 1
    };
  }

  calculateTotalOverdue() {
    this.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

  }

  toggleLeavingShowWarning() {
    this.leavingShowWarning = !this.leavingShowWarning
  }

  selectOption(option: ProductVariationOption, name) {
    if (this.product && name === 'Coulor') {
      this.colors.ProductVariationOptions.map(x => x.Class = []);
      this.product.SelectedCoulor = option.OptionName;
      this.colors.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
      option.Class = ['active-color'];
      this.selectedOption = option;
      if (this.colors && this.colors.ProductVariationOptions && this.colors.ProductVariationOptions.length && this.product.AllImages) {
        this.product.Images = this.product.AllImages.filter(img => img.OptionId === this.selectedOption.Id);
        if (!this.product.Images.length) {
          this.product.Images = this.product.AllImages;
        }
        this.product.FeaturedImageUrl = this.product.Images[0].Url

      }
    }
    if (this.product && name === 'Size') {
      this.sizes.ProductVariationOptions.map(x => x.Class = []);
      this.product.SelectedSize = option.OptionName;
      this.sizes.ProductVariationOptions.map(x => x.IsSelected = false);
      option.IsSelected = true;
      option.Class = ['active'];

    }
    console.log(name, option);

  }
  checkoutOrShopMore(event: string) {
    this.checkoutOrShopMoreEvent.emit(event);
  }
  showImage(image: Images) {
    if (image && this.product.Images) {
      this.product.Images.map(x => x.Class = [])
      image.Class = ['active']
      this.product.FeaturedImageUrl = image.Url;
    }
  }
  handleSwipe(direction) {
    this.imageClass = '';
    if (direction === 'left') {
      if (this.product && this.product.Images) {
        this.imageIndex++;
        this.product.ClassSelector = `class-${this.product.ProductId}`;
        // this.imageClass = 'animation-next-slide';
        if (this.imageIndex > this.product.Images.length - 1) {
          this.imageIndex = 0;
        }
        const featuredImageUrl = this.product.Images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl);
        }
      }
    }
    if (direction === 'right') {
      if (this.product && this.product.Images) {
        this.imageIndex--;
        // this.imageClass = 'animation-next-slide';
        if (this.imageIndex < 0) {
          this.imageIndex = this.product.Images.length - 1;
        }
        const featuredImageUrl = this.product.Images[this.imageIndex];
        if (featuredImageUrl) {
          this.showImage(featuredImageUrl);
        }
      }
    }

  }

  share() {
    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = this.fullLink;
      nav.share({
        title: 'Hello, checkout.',
        text: `Hi, please check out *${this.product.Name}*`,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Product Link Copied to clipboard.');

    }
  }

  cart() {
    this.router.navigate(['shop/cart']);
  }

  gotoCompany() {
    this.router.navigate([this.company.Slug || this.company.CompanyId]);
  }


  goto(url) {
    this.router.navigate([url]);
  }
  onLike(like: string) {
    this.like = like;
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
        InteractionTargetId: this.product.ProductId,
        TraceId: '1',
        InteractionBody: "1",
        Color: this.product.SelectedCoulor || '',
        Size: this.product.SelectedSize || '',
        Price: this.product.RegularPrice,
        Name: this.product.Name,
        Description: this.product.Description,
        InteractionStatus: "Valid",
        ImageUrl: this.product.FeaturedImageUrl,
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
        console.log(data);
        this.getInteractionSync();
        this.pendingActionLike = false;

      })
    }

    if (like === 'no' && this.interaction.InteractionId && this.interaction.CreateDate) {
      this.interactionService.delete(this.interaction.InteractionId).subscribe(data => {
        console.log(data);
        this.getInteractionSync();
      })
    }


  }

  getInteractions() {
    if (!this.user || !this.selectedProduct) {
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.selectedProduct.ProductId,
      InteractionType: INTERRACTION_TYPE_LIKE,
      StatusId: 1
    }
    this.interactionService.getInteractions(interactionSearchModel).subscribe(data => {
      if (data && data.length) {
        const liked = data.find(x => x.InteractionType === 'Like');
        if (liked) {
          this.interaction = liked;
          this.liked = 'yes';
        }
      }
    })
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

  // loadCategories() {
  //   this.productService.productListObservable.subscribe(products => {
  //     if (products && products.length) {
  //       this.otherproducts = products.filter(x => x.CompanyId === this.company.CompanyId);
  //     }
  //   });


  // }
}
