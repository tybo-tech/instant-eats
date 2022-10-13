import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BASE, environment } from 'src/environments/environment';
import { Category, Order, Orderproduct, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { Interaction, InteractionSearchModel } from 'src/models/interaction.model';
import { FeesModel, Item } from 'src/models/item.model';
import { OrderOption } from 'src/models/order.option.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { Promotion } from 'src/models/promotion.model';
import { NavHistoryUX } from 'src/models/UxModel.model';
import { AccountService, OrderService, UserService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { InteractionService } from 'src/services/Interaction.service';
import { ItemService } from 'src/services/item.service';
import { ProductService } from 'src/services/product.service';
import { UxService } from 'src/services/ux.service';
import { ADMIN, DISCOUNT_TYPES, INTERRACTION_TYPE_LIKE, MAX_PAGE_SIZE, OPEN_CLOSE, ORDER_TYPE_SALES, VARIATION_NUMBER_OF_SELECTION, VARIATION_PRICE_MODES, VARIATION_SELECTION_MODES } from 'src/shared/constants';
import { getConfig, WebConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-shop-products',
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss']
})
export class ShopProductsComponent implements OnInit {

  promotions: Promotion[];
  shopSlug: any;
  company: Company;
  selectedCategory: Category;
  products: Product[];
  allProducts: Product[];
  user: User;
  navHistory: NavHistoryUX;
  interaction: Interaction;
  productVariation
  liked: string = 'no';
  priceFrom: string;
  showAdd: boolean;
  parentCategories: Category[] = [];
  catergories: Category[] = [];
  tertiaryCategories: Category[] = [];
  shopOwner: User;
  ADMIN = ADMIN;
  searchString: string
  nextPage = 999999;
  showShowMore: boolean;
  selectedProduct: Product;
  heading = `follow a shop.`
  pendingActionLike: boolean;
  likeAction: string;
  showSetUpCompany: boolean;
  carttItems = 0;
  showCart = true;
  loading = true;
  order: Order;
  fullLink: string;
  emptyShop: boolean;
  leavingShowWarning: boolean;
  Total: number;
  product: Product;
  VARIATION_NUMBER_OF_SELECTION = VARIATION_NUMBER_OF_SELECTION;
  OPEN_CLOSE = OPEN_CLOSE
  warning: string;
  productId: any;
  fees: FeesModel[];
  config: WebConfig;
  constructor(
    private homeShopService: HomeShopService,
    private productService: ProductService,
    private uxService: UxService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private companyService: CompanyService,
    private interactionService: InteractionService,
    private accountService: AccountService,
    private userService: UserService,
    private itemService: ItemService,
    private orderService: OrderService,

  ) {
    this.activatedRoute.params.subscribe(r => {
      itemService.feesObservable.subscribe(fees => {
        if (fees && fees.length) {
          const product = fees.find(x => x.ItemType === 'product');
          if (product)
            this.fees = JSON.parse(product.Description);
        }
      })
      this.shopSlug = r.id;
      this.productId = r.productId;
      this.user = this.accountService.currentUserValue;
      this.getProducts(this.nextPage);
      this.uxService.uxNavHistoryObservable.subscribe(data => {
        this.navHistory = data;
      })

    });
  }

  ngOnInit() {
    this.config = getConfig(BASE);
    this.accountService.user.subscribe(data => {
      this.user = data;
      // this.getInteractions();
      if (this.pendingActionLike) {
        this.onLike(this.likeAction);
      }

    })
  }

  back() {
    if (this.product) {
      this.product = null;
      return;
    }
    if (this.navHistory && this.navHistory.BackToAfterLogin) {
      this.router.navigate([this.navHistory.BackToAfterLogin]);
    } else {
      this.router.navigate(['']);
    }
  }
  getProduct(productId: string) {
    if (productId && productId.length > 3) {
      this.productService.getProductSync(productId).subscribe(data => {
        if (data && data.ProductId) {
          data.SelectedQuantiy = 1;
          this.select(data);
        }
      })
    }
  }
  select(product) {
    this.product = product;
    this.product.SelectedQuantiy = 1;
    if (this.product && this.product.ProductVariations) {
      this.product.ProductVariations.forEach(variation => {
        if (variation.PriceMode === VARIATION_PRICE_MODES[0].Name) {
          let i = 0;
          if (variation.ProductVariationOptions && variation.ProductVariationOptions.length) {
            variation.ProductVariationOptions.forEach((option, index) => {
              if (Number(option.Price) < (Number(variation.ProductVariationOptions[i].Price))) {
                i = index;
              }
            });
            this.product.RegularPrice = 0;
            this.selectOption(variation.ProductVariationOptions[i], variation);
          }
        }

      })
    }

  }

  selectOption(option: ProductVariationOption, item: ProductVariation) {
    if (item.NumberOfSelection === VARIATION_NUMBER_OF_SELECTION[0].Name) {
      const selected = item.ProductVariationOptions.find(x => x.IsSelected);
      if (selected) {
        this.product.RegularPrice -= Number(selected.Price);
      }
      item.ProductVariationOptions.map(x => x.IsSelected = false);
    }
    option.IsSelected = !option.IsSelected;
    if (!option.IsSelected) {
      this.product.RegularPrice -= Number(option.Price);
    }
    if (option.IsSelected) {
      this.product.RegularPrice += Number(option.Price);
    }
  }


  mapOrderOptions(product: Product) {
    const options: OrderOption[] = [];
    if (product && product.ProductVariations) {
      product.ProductVariations.forEach(variation => {
        variation.ProductVariationOptions.forEach((option) => {
          if (option.IsSelected) {
            options.push({
              ProductVariationId: variation.Id,
              ProductId: product.ProductId,
              VariationOptionId: option.Id,
              VariationName: variation.VariationName,
              OptionName: option.OptionName,
              Price: Number(option.Price)
            })
          }
        });

      })
    }
    return options;
  }
  share() {
    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      const url = `${environment.BASE_URL}/${this.company.CompanyId}`;
      nav.share({
        title: 'Hello there, please checkout.',
        text: `Hi, please check out *${this.company.Name}*`,
        url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Product Link Copied to clipboard.');

    }
  }
  getMin(array: number[]) {
    let min = array[0];
    for (let i = 1; i < array.length; ++i) {
      if (array[i] < min) {
        min = array[i];
      }
    }
    return min;
  }
  getProducts(maxId: number) {
    this.warning = undefined;
    this.productService.getAllActiveProductsForCompany(this.shopSlug, maxId).subscribe(data => {
      this.loading = false;
      this.getProduct(this.productId);

      if (data && data.length) {




        this.products = this.proccessProducts(data);
        this.allProducts = data;
        this.products.map(x => x.SelectedQuantiy = 1);
        this.company = this.products[0].Company;
        this.loadCart();
        this.emptyShop = !this.products[0].ProductId;

        this.fullLink = `${environment.BASE_URL}/${this.company.CompanyId}`;
        if (this.company && this.company.Followers) {
          this.company.Followers = this.company.Followers.filter(x => x.SourceName && x.SourceDp)
        }
        if (this.company) {
          this.warning = this.companyService.getWarning(this.company);
          console.log(this.warning || 'No warn');

          this.interactionService.logCompanyPage(this.user, this.company);
        }
        this.nextPage = this.products[this.products.length - 1]?.Id || 99999;
        this.promotions = this.company.Promotions || [];
        this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

        this.getInteractions();
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
        if (this.promotions && this.promotions.length) {
          const promo = this.promotions[0];
          this.products.forEach(product => {
            if (promo.PromoType === DISCOUNT_TYPES[0]) {
              product.SalePrice = (Number(product.RegularPrice) * (Number(promo.DiscountValue) / 100));
              product.SalePrice = (Number(product.RegularPrice) - (Number(product.SalePrice)));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }
            if (promo.PromoType === DISCOUNT_TYPES[1]) {
              (product.SalePrice = (Number(product.RegularPrice) - (Number(promo.DiscountValue))));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }

            if (Number(product.SalePrice) < Number(product.RegularPrice)) {
              product.OnSale = true;
            }
          }
          )

        }


      }
    });



  }


  cart() {
    this.router.navigate(['shop/cart']);
  }
  getTotalCartItems() {
    this.carttItems = 0
    this.order.Orderproducts.forEach(item => {
      this.carttItems += Number(item.Quantity);
    })
  }
  loadCart() {
    this.order = this.orderService.currentOrderValue;
    if (!this.order) {
      this.order = {
        OrdersId: '',
        OrderNo: 'Shop',
        CompanyId: this.company.CompanyId,
        Company: this.company,
        CustomerId: '',
        AddressId: '',
        Notes: '',
        OrderType: ORDER_TYPE_SALES,
        Total: 0,
        Paid: 0,
        Due: 0,
        DriverTip: 0,
        InvoiceDate: new Date(),
        DueDate: '',
        CreateUserId: 'shop',
        ModifyUserId: 'shop',
        Status: 'Not paid',
        StatusId: 1,
        Orderproducts: []
      }
      this.order.CashCollected = 0;
      this.order.ServiceFee = 0;
      this.orderService.updateOrderState(this.order);
    }
    this.getTotalCartItems();
  }

  loadMore() {
    this.productService.getAllActiveProductsForCompanySync(this.shopSlug, this.nextPage).subscribe(data => {
      if (data && data.length) {
        const products = this.proccessProducts(data);
        this.products.push(...data);
        this.nextPage = data[data.length - 1]?.Id || 99999999;
        this.showShowMore = data.length >= MAX_PAGE_SIZE;
      }
    });

  }

  proccessProducts(products: Product[]) {
    if (!products) return [];
    products.forEach(product => {
      product.OldPrice = product.RegularPrice;
      product.RegularPrice = this.productService.commisionPrice(product.RegularPrice, this.fees);
      if (product && product.ProductVariations) {
        product.ProductVariations.forEach(variation => {
          let basesPrices: number[] = [];
          if (variation.ProductVariationOptions && variation.ProductVariationOptions.length && variation.PriceMode === VARIATION_PRICE_MODES[0].Name) {

            variation.ProductVariationOptions.forEach(variationOption => {
              product.OldPrice = Number(product.OldPrice) + Number(variationOption.Price);
              variationOption.Price = this.productService.commisionPrice(variationOption.Price, this.fees);
            });

            basesPrices = variation.ProductVariationOptions.map(x => {
              if (x.Price) {
                return Number(x.Price)
              }
            });
            product.PriceFromLabel = 'From ';
            product.RegularPrice = this.getMin(basesPrices);
          }

        });
      }
    })
    return products;
  }

  viewMore(product: Product) {
    if (product) {
      this.selectedProduct = product;
      return
      this.homeShopService.updateProductState(product);
      this.uxService.keepNavHistory(null);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
  selectCategory(category: Category) {
    if (category && category.IsShop) {
      this.homeShopService.updateCategoryState(category);
      this.router.navigate([`shop/collections/${category.Name}`])
    }

  }
  tapChildCategory(category: Category) {
    if (category) {
      this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId && x.CategoryGuid === category.CategoryId);
    }

  }
  all() {
    this.products = this.products = this.allProducts.filter(x => x.CompanyId === this.company.CompanyId);

  }

  goto(url) {
    this.router.navigate([url]);
  }




  onLike(like: string) {
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
          this.getInteractions();
          this.pendingActionLike = false;
          this.uxService.showQuickMessage('Shop added to favorites.');
          this.getInteractionSync();
          this.getProducts(99999999);

        }
      })
    }

    if (like === 'no' && this.interaction && this.interaction.InteractionId && this.interaction.CreateDate) {
      this.interactionService.delete(this.interaction.InteractionId).subscribe(data => {
        this.company.Liked = false;
        this.uxService.showQuickMessage('Shop removed from favorites.');
        this.getInteractionSync();
        this.getInteractions();
        this.getProducts(99999999);
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
    if (!this.user) {
      return false;
    }
    const interactionSearchModel: InteractionSearchModel = {
      InteractionSourceId: this.user.UserId,
      InteractionTargetId: this.company.CompanyId,
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

  loadCategories() {
    const catergories = [];
    // this.parentCategories = [];
    // this.tertiaryCategories = [];

    this.productService.productListObservable.subscribe(products => {
      if (products && products.length) {
        const pro: Product = products.find(x => x.Company && x.Company.Slug === this.shopSlug || x.Company && x.Company.CompanyId === this.shopSlug);
        if (pro) {
          this.company = pro.Company;
          this.promotions = this.company.Promotions || [];
          this.promotions.map(x => x.Style = { background: x.Bg, color: x.Color });

          this.getInteractions();

          this.products = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.allProducts = products.filter(x => x.CompanyId === this.company.CompanyId);
          this.products.forEach(product => {
            if (!catergories.find(x => x && x.CategoryId === product.CategoryGuid)) {
              if (product.Category) {
                catergories.push(product.Category);
              }
            }
            if (!this.parentCategories.find(x => x && x.CategoryId === product.ParentCategoryGuid)) {
              if (product.ParentCategory) {
                this.parentCategories.push(product.ParentCategory);
              }
            }
            if (!this.tertiaryCategories.find(x => x && x.CategoryId === product.TertiaryCategoryGuid)) {
              if (product.TertiaryCategory) {
                this.tertiaryCategories.push(product.TertiaryCategory);
              }
            }
          });

          if (catergories && catergories.length) {
            this.catergories = catergories;
          }
        }

      }
    });


  }

  tabParentCategories(category: Category) {
    if (category) {
      this.parentCategories.map(x => x.Class = ['']);
      category.Class = ['active'];
    }
  }
  gotoDashboard() {
    this.router.navigate(['admin/dashboard'])
  }
  qtyChanged(qty, product: Product) {
    product.SelectedQuantiy = qty;
  }

  addToCart(product: Product) {
    if (this.order && this.order.Orderproducts.length) {
      if (this.order.CompanyId !== product.CompanyId) {
        this.leavingShowWarning = true;
        return false;
      }

    }

    if (product && product.ProductId) {
      const orderproduct = this.orderService.mapOrderproduct(product);
      orderproduct.OrderOptions = this.mapOrderOptions(product);
      product.IsSelected = true;
      this.order.Orderproducts.push(orderproduct);
      if (product.Company) {
        this.order.Company = product.Company;
      }
      this.order.CompanyId = product.CompanyId;
      this.calculateTotalOverdue();
      this.order.Total = this.Total;
      this.orderService.updateOrderState(this.order);
      this.getTotalCartItems();
      this.uxService.showQuickMessage(`${product.Name} added to cart successfully.`)
      this.cart();
    }
  }
  calculateTotalOverdue() {
    this.Total = 0;
    this.order.Orderproducts.forEach(line => {
      this.Total += (Number(line.UnitPrice) * Number(line.Quantity));
    });

  }

  next() {
    this.product.SelectedQuantiy++;
  }
  prev() {
    if (this.product.SelectedQuantiy <= 1) {
      return;
    }
    this.product.SelectedQuantiy--;


  }
}
