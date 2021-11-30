import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Category, Product, Variation, VariationOption } from 'src/models';
import { ProductVariation } from 'src/models/product.variation.model';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { ProductService, AccountService, CompanyVariationService, CompanyCategoryService } from 'src/services';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, PRODUCTS_MODES, PRODUCT_TYPE_STOCK, STATUS_ACTIIVE_STRING, SUPER, VARIATION_NUMBER_OF_SELECTION, VARIATION_PRICE_MODES, VARIATION_REQUIRED_MODES } from 'src/shared/constants';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  productId: string;
  companyId: string;
  tabId: number;
  product: Product;
  selectItem: any;
  categories: Category[];
  chilndrenCategories: Category[];
  variations: Variation[];
  suggestion: Variation;
  option: VariationOption;
  productVariation: ProductVariation
  user: any;
  addEditCompanyHeading: string;
  PRODUCTS_MODES = PRODUCTS_MODES;
  VARIATION_PRICE_MODES = VARIATION_PRICE_MODES;
  VARIATION_REQUIRED_MODES = VARIATION_REQUIRED_MODES;
  VARIATION_NUMBER_OF_SELECTION = VARIATION_NUMBER_OF_SELECTION;
  constructor(
    private productService: ProductService,
    private accountService: AccountService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private uxService: UxService,
    private companyVariationService: CompanyVariationService,
    private companyCategoryService: CompanyCategoryService,
    private productVariationService: ProductVariationService,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.productId = r.id;
      this.tabId = Number(r.tab);
      this.goto(PRODUCTS_MODES[this.tabId - 1]);
      this.companyId = r.companyId;
      this.getProduct();
    });
  }
  ngOnInit(): void {
    this.laodCats();
    this.loadVariations();
    this.user = this.accountService.currentUserValue;

  }

  getProduct() {
    if (this.productId === 'add') {
      this.addEditCompanyHeading = 'Add product.';
      this.product = {
        ProductId: '',
        ShowRemainingItems: 6,
        CompanyId: this.companyId,
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
    } else {
      this.addEditCompanyHeading = 'Edit product.';
      this.uxService.showLoader();
      this.productService.getProductSync(this.productId).subscribe(data => {
        this.product = data;
        this.uxService.hideLoader();
        if (this.product && this.product.ProductId) {
          if (!this.product.ProductVariations) {
            this.product.ProductVariations = [];
          }
          this.product.ProductVariations.forEach(variation => {
            variation.ProductVariationOptions.push({
              ProductVariationId: variation.Id,
              ProductId: this.product.ProductId,
              VariationId: variation.Id,
              VariationOptionId: '',
              VariationName: variation.VariationName,
              ImageUrl: '',
              ShowOnline: 'show',
              Description: '',
              OptionName: '',
              Price: undefined,
              CreateUserId: this.user.UserId,
              ModifyUserId: this.user.UserId,
              StatusId: 1
            });
          })
        }
      })
    }
  }


  goto(currentTab) {
    this.PRODUCTS_MODES.map(x => x.Class = []);
    currentTab.Class = ['active'];
    this.tabId = currentTab.Id;
    // this.router.navigate([`admin/dashboard/invoices/${currentTab.Id}/${this.companyId}`])
  }
  onImageChangedEvent(url) {
    if (this.product) {
      this.product.FeaturedImageUrl = url;
    }
  }
  addProductVariation() {
    this.suggestion = null;
    this.productVariation = {
      ProductId: this.productId,
      CompanyVariationId: this.companyId,
      VariationName: '',
      PriceMode: VARIATION_PRICE_MODES[1].Name,
      IsRequired: VARIATION_REQUIRED_MODES[0].Name,
      NumberOfSelection: VARIATION_NUMBER_OF_SELECTION[0].Name,
      CreateUserId: this.user.UserId,
      ModifyUserId: this.user.UserId,
      StatusId: 1
    }
  }
  laodCats() {

    this.companyCategoryService.getSystemCategories(SUPER, 'All');
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data && data.length) {
        this.categories = data;
        this.chilndrenCategories = data.filter(x => x.CategoryType === "Child");
        if (this.product && !this.product.CategoryGuid) {
          this.product.CategoryGuid = this.chilndrenCategories[0].CategoryId;
          this.product.CategoryName = this.chilndrenCategories[0].Name;
        }
      }
    });
  }


  loadVariations() {
    this.companyVariationService.getAllVariations(COMPANY_TYPE).subscribe(data => {
      if (data) {
        if (data && data.length) {
          this.variations = data;
          this.variations.forEach(variation => {
            variation.VariationsOptions.map(x => x.Class = [])
          })
        }
        // this.loadListItems();
      }
    });
  }


  optionChanged(productVariation: ProductVariationOption, variation: ProductVariation) {
    if (!productVariation.CreateDate) {
      return;
    } else {
      this.saveOption(productVariation, variation)
    }
  }
  saveOption(productVariation: ProductVariationOption = null, variation: ProductVariation) {
    if (!productVariation.OptionName) {
      return;
    }
    productVariation.Price = productVariation.Price || 0;
    if (productVariation.CreateDate) {
      this.productVariationService.updateProductVariationOption(productVariation).subscribe(data => {
        if (data && data.Id) {
          this.uxService.showQuickMessage('Option updated')
        }
      })


    } else {
      this.productVariationService.addProductVariationOption(productVariation).subscribe(data => {
        if (data && data.Id) {
          this.uxService.showQuickMessage('Option saved');
          variation.ProductVariationOptions.push(

            {
              ProductVariationId: variation.Id,
              ProductId: this.product.ProductId,
              VariationId: variation.Id,
              VariationOptionId: '',
              VariationName: variation.VariationName,
              ImageUrl: '',
              ShowOnline: 'show',
              Description: '',
              OptionName: '',
              Price: undefined,
              CreateUserId: this.user.UserId,
              ModifyUserId: this.user.UserId,
              StatusId: 1
            }
          )
          // this.product.ProductVariations.push(data);

        }
      })
    }

  }

  addProductVariationOptionsRange(productVariations: ProductVariationOption[], variation: ProductVariation) {
    if (!productVariations.length) {
      return;
    }


    this.productVariationService.addProductVariationOptionsRange(productVariations).subscribe(data => {
      this.uxService.showLoader();
      if (data && data.length) {
        this.uxService.showQuickMessage('Options saved');
        // variation.ProductVariationOptions = data;
        this.getProduct();
        // this.product.ProductVariations.push(data);
      }
    })

  }

  deleteOption(productVariation: ProductVariationOption, i, variation: ProductVariation) {
    this.productVariationService.deleteProductOption(productVariation.Id).subscribe(data => {
      if (data && Number(data) === 1) {
        variation.ProductVariationOptions.splice(i, 1);
        this.uxService.showQuickMessage('Option deleted')
      }
    })
  }


  saveProduct() {
    this.product.ProductSlug = this.productService.generateSlug('', this.product.Name, this.product.Code);

    if (this.product && this.product.CategoryGuid) {
      this.product.CategoryName = this.chilndrenCategories.find(x => x.CategoryId === this.product.CategoryGuid)?.Name || ''
    }
    if (this.product.CreateDate && this.product.ProductId.length > 5) {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Updating item..., please wait.' })
      this.productService.update(this.product).subscribe(data => {
        if (data && data.ProductId) {
          this.uxService.hideLoader();
          this.uxService.showQuickMessage('Item updated.');

        }
      });
    } else {
      this.uxService.updateLoadingState({ Loading: true, Message: 'Adding item..., please wait.' })
      this.productService.add(this.product).subscribe(data => {
        if (data && data.ProductId) {
          this.router.navigate([`admin/dashboard/product/${data.ProductId}/${this.companyId}/2`]);
          this.uxService.hideLoader();
          this.uxService.showQuickMessage('Item created.');
        }
      });
    }

  }

  back() {
    this.router.navigate(['admin/dashboard/products', this.companyId]);
  }

  saveProductVariation() {
    if (this.productVariation.CreateDate && this.productVariation.Id) {
      this.productVariationService.updateSync(this.productVariation).subscribe(data => {
        this.uxService.showQuickMessage('Product Variation created.');
        this.productVariation = null;
      })
    } else {
      this.productVariationService.addSync(this.productVariation).subscribe(data => {
        this.uxService.showQuickMessage('Product Variation created.');
        if (data && data.Id) {
          data.ProductVariationOptions = [
            {
              ProductVariationId: data.Id,
              ProductId: this.product.ProductId,
              VariationId: data.Id,
              VariationOptionId: '',
              VariationName: data.VariationName,
              ImageUrl: '',
              ShowOnline: 'show',
              Description: '',
              OptionName: '',
              Price: undefined,
              CreateUserId: this.user.UserId,
              ModifyUserId: this.user.UserId,
              StatusId: 1
            }
          ]
        }
        this.product.ProductVariations.push(data);

        if (this.suggestion && this.suggestion.VariationsOptions) {
          const productVariations: ProductVariationOption[] = [];

          this.suggestion.VariationsOptions.forEach(item => {
            if (item.Name) {
              productVariations.push({
                ProductVariationId: data.Id,
                ProductId: this.product.ProductId,
                VariationId: this.suggestion.VariationId,
                VariationOptionId: '',
                VariationName: this.suggestion.Name,
                ImageUrl: '',
                ShowOnline: 'show',
                Description: '',
                OptionName: item.Name,
                Price: 0,
                CreateUserId: this.user.UserId,
                ModifyUserId: this.user.UserId,
                StatusId: 1
              })
            }

          });
          this.addProductVariationOptionsRange(productVariations, this.productVariation);
        }
        this.productVariation = null;


      })
    }

  }
}
