import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Category, CompanyCategory, Product, User } from 'src/models';
import { Images } from 'src/models/images.model';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { BreadModel } from 'src/models/UxModel.model';
import { AccountService, CompanyCategoryService, ProductService, UploadService } from 'src/services';
import { ImagesService } from 'src/services/images.service';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { IMAGE_CROP_SIZE, PRODUCT_ORDER_LIMIT_MAX, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, STATUS_TRASHED_STRING } from 'src/shared/constants';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  showLoader;
  @Input() existingProduct: Product;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() addingProductFinished: EventEmitter<Product> = new EventEmitter();
  setUpVariations: boolean;
  product: Product = {
    ProductId: '',
    ShowRemainingItems: 6,
    CompanyId: '',
    Name: '',
    TotalStock: 0,
    RegularPrice: 0,
    PriceFrom: 0,
    PriceTo: 0,
    Description: '',
    ProductSlug: '',
    CatergoryId: 0,
    ParentCategoryId: 0,
    CategoryName: '',
    ParentCategoryName: '',
    ParentCategoryGuid: '',
    CategoryGuid: '',
    TertiaryCategoryGuid: '',
    TertiaryCategoryName: '',
    ReturnPolicy: '',
    FeaturedImageUrl: '',
    IsJustInTime: PRODUCT_TYPE_STOCK,
    ShowOnline: true,
    EstimatedDeliveryDays: 0,
    OrderLimit: 0,
    SupplierId: '',
    ProductType: '',
    ProductStatus: STATUS_ACTIIVE_STRING,
    Code: '',
    CreateDate: '',
    CreateUserId: '',
    ModifyDate: '',
    ModifyUserId: '',
    StatusId: 1,
  };
  shoWaddNewCatergory: boolean
  editorStyle = {
    height: '180px',
    marginBottom: '30px',
    color: 'black',
  };
  user: User;
  PRODUCT_ORDER_LIMIT_MAX = PRODUCT_ORDER_LIMIT_MAX;
  parentCategories: Category[] = [];
  chilndrenCategories: Category[] = [];
  tertiaryCategories: Category[] = [];
  categories: Category[] = [];


  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      // ['image']
    ]
  };
  newCatergory: Category;
  sizes: ProductVariation;
  colors: ProductVariation;
  items: BreadModel[];
  STATUS_TRASHED_STRING = STATUS_TRASHED_STRING;
  productLink: any;

  constructor(
    private router: Router,
    private productService: ProductService,
    private accountService: AccountService,
    private companyCategoryService: CompanyCategoryService,
    private uploadService: UploadService,
    private imagesService: ImagesService,
    private uxService: UxService,
    private productVariationService: ProductVariationService,



  ) { }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    this.productService.productObservable.subscribe(data => {
      if (data) {
        this.product = data;
        this.laodCats();
        this.productLink = `${environment.BASE_URL}/shop/product/${this.product.ProductSlug || this.product.ProductId}`;
        if (!this.product.ShowRemainingItems) {
          this.product.ShowRemainingItems = 6;
        }
        this.loadOptions();

        this.items = [
          {
            Name: 'Dashboard',
            Link: '/admin/dashboard'
          },
          {
            Name: 'Products',
            Link: '/admin/dashboard/products'
          },
          {
            Name: this.product.Name,
            Link: null
          }
        ];
      }
    })
    if (this.existingProduct && this.existingProduct.ProductId) {
      this.product = this.existingProduct;
    }
    else {
      this.product.CompanyId = this.user.CompanyId;
      this.product.CreateUserId = this.user.CompanyId;
      this.product.ModifyUserId = this.user.CompanyId;
      this.productService.getProducts(this.user.CompanyId);

      this.productService.productListObservable.subscribe(data => {
        if (data) {
          this.product.Code = `P00${data.length + 1}`;
        }
      });
    }


    this.loadOptions();

  }

  laodCats(){
    
    this.companyCategoryService.getSystemCategories(this.user.CompanyId, 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.chilndrenCategories = data.filter(x=>x.CategoryType === "Child");
        if(!this.product.CategoryGuid){
          this.product.CategoryGuid = this.chilndrenCategories[0].CategoryId;
          this.product.CategoryName = this.chilndrenCategories[0].Name;
        }
      }
    });
  }
  name() { }
  loadOptions() {

    if (this.product) {
      this.sizes = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Size');
      this.colors = this.product.ProductVariations && this.product.ProductVariations.find(x => x.VariationName === 'Color');
      if (this.product.Images && this.product.Images.length) {
        this.product.Images[0].Class = ['active']
      }
    }
  }
  saveProduct() {
    // this.product.ProductSlug = this.productService.generateSlug(this.user.Company.Name, this.product.Name, this.product.Code);
    if (this.product.ParentCategoryGuid) {
      this.product.ParentCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.ParentCategoryGuid).Name;
    }
    if (this.product.CategoryGuid) {
      this.product.CategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.CategoryGuid).Name;
    }
    if (this.product.TertiaryCategoryGuid) {
      this.product.TertiaryCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.TertiaryCategoryGuid).Name;
    }
    this.uxService.updateLoadingState({ Loading: true, Message: 'Saving a product, please wait...' })
    if (this.product.ProductId && this.product.CreateDate) {
      this.productService.update(this.product).subscribe(data => {
        this.uxService.updateLoadingState({ Loading: false, Message: undefined });

        if (data) {
          this.addingProductFinished.emit(data);
        }
      });
    } else {
      this.productService.add(this.product).subscribe(data => {
        if (data && data.ProductId) {
          this.product.ProductId = data.ProductId;
          this.product.CreateDate = data.CreateDate;
          this.addingProductFinished.emit(data);
          this.showLoader = false;
        }
      });
    }

  }
  back() {
    this.router.navigate([`/admin/dashboard/products`]);
  }


  onProductVariationChanged(productVariations: ProductVariation[]) {
    if (productVariations && productVariations.length) {
      this.product.ProductVariations = productVariations;

    }

  }
  onCloseOptionModal(e) {
    this.setUpVariations = false;
  }
  saveImage(image: Images) {
    if (image) {

      this.showLoader = true;
      this.imagesService.add(image).subscribe(data => {
        if (data && data.ImageId) {
          if (!this.product.Images) {
            this.product.Images = [];
          }
          this.product.Images.push(data);
          if (!this.product.FeaturedImageUrl) {
            this.product.FeaturedImageUrl = this.product.Images[0].Url;
          }
          this.showLoader = false;
          this.uxService.showQuickMessage(`New Image uploaded.`);
          this.productService.updateProductState(this.product);
        }

      })
    }
  }

  deleteImage(image: Images) {
    if (image) {
      image.StatusId = 2;
      this.showLoader = true;
      this.imagesService.update(image).subscribe(data => {
        if (data && data.ImageId) {
          this.showLoader = false;
          this.product.Images.splice(image.Index, 1);
          this.uxService.showQuickMessage(`Image deleted.`);
        }

      })
    }
  }
  setMianImage(image: Images) {
    if (image) {
      const main = this.product.Images.find(x => x.ImageId === image.ImageId);
      if (main) {
        this.product.Images.map(x => x.IsMain = 0);
        main.IsMain = 1;
        this.showLoader = true;
        this.imagesService.updateRange(this.product.Images).subscribe(data => {
          if (data && data.ProductId && data.Images) {
            this.showLoader = false;
            this.product.Images = data.Images;
            this.product.FeaturedImageUrl = main.Url;
            this.product.Images.sort(function (a, b) {
              var textA = a.IsMain.toString();
              var textB = b.IsMain.toString();;
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            this.productService.updateProductState(this.product);
            this.productService.update(this.product).subscribe(data => {
              console.log(data);
            })
          }

        })
      }
    }
  }
  showImage(image: Images) {
    this.product.FeaturedImageUrl = image.Url;
  }


  saveCatergory() {
    if (this.newCatergory.CategoryId && this.newCatergory.CategoryId.length > 5) {
      this.companyCategoryService.update(this.newCatergory).subscribe(data => {

      })
    }
    else {
      this.companyCategoryService.add(this.newCatergory).subscribe(data => {
        if (data && data.CategoryId) {
          if (!this.chilndrenCategories || !this.chilndrenCategories.length) {
            this.chilndrenCategories = [];
          }
          if (!this.categories || !this.categories.length) {
            this.categories = [];
          }
          if (data.CategoryType === 'Tertiary') {
            this.tertiaryCategories.push(data);
            this.product.TertiaryCategoryGuid = data.CategoryId;
            this.product.CategoryName = data.Name;

          }
          if (data.CategoryType === 'Child') {
            this.chilndrenCategories.push(data);
            this.product.CategoryGuid = data.CategoryId;
            this.product.CategoryName = data.Name;
          }
          this.categories.push(data);
          this.uxService.showQuickMessage(`New category created.`);
          this.newCatergory = undefined;
          this.shoWaddNewCatergory = false;
        }
      });
    }
  }

  toggleShowOnline(e: boolean) {

  }

  catChanged() {
    // alert(this.product.CategoryGuid)
    if (this.product.CategoryGuid === 'add' || !this.product.CategoryGuid) {
      this.addNewSubCat('Child');
    }
    if (this.product.TertiaryCategoryGuid === 'add-tertiary') {
      this.addNewSubCat('Tertiary');
    }
  }


  addNewSubCat(type) {
    this.shoWaddNewCatergory = true;
    this.newCatergory = {
      CategoryId: '',
      Name: '',
      ParentId: '',
      Description: '',
      DisplayOrder: 0,
      CategoryType: type,
      CompanyType: 'Foods',
      ImageUrl: '',
      PhoneBanner: '',
      IsDeleted: false,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1,
      Children: []
    };

  }
  toggleSetUpVariations() {
    if (this.product.ParentCategoryGuid) {
      this.product.ParentCategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.ParentCategoryGuid).Name;
    }
    if (this.product.CategoryGuid) {
      this.product.CategoryName = this.categories && this.categories.find(x => x.CategoryId === this.product.CategoryGuid).Name;
    }
    this.productService.update(this.product).subscribe(res => {
      if (res && res.ProductId) {
        this.productService.updateProductState(res);
        this.router.navigate(['admin/dashboard/product-variations', this.product.ProductId]);
      }
    })
  }
  toggleShowOptionOnline(option: ProductVariationOption, showOnline: string) {
    option.ShowOnline = showOnline;
    this.productVariationService.updateProductVariationOption(option).subscribe(data => {
      console.log(data);

    })
  }

  delete() {
    if (confirm("Product will be moved trash, press ok to continue.")) {
      this.product.ProductStatus = STATUS_TRASHED_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          this.back();
        }
      })
    }

  }
  undelete() {
    if (confirm("Product will be moved out of trash to active, press ok to activate product.")) {
      this.product.ProductStatus = STATUS_ACTIIVE_STRING;
      this.productService.update(this.product).subscribe(res => {
        if (res && res.ProductId) {
          this.productService.updateProductState(res);
          // this.back();
          this.uxService.showQuickMessage('Product is now active')
        }
      })
    }

  }

  copy() {

    let nav: any;
    nav = window.navigator;
    if (nav.share) {
      nav.share({
        title: 'Hello there!',
        text: `Check out this ${this.product.Name}`,
        url: this.productLink
        ,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.uxService.showQuickMessage('Shop LinkCopied to clipboard.');
    }
  }
}
