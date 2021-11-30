import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Category, Product, Variation, VariationOption } from 'src/models';
import { ProductVariationOption } from 'src/models/product.variation.option.model';
import { SliderWidgetModel } from 'src/models/UxModel.model';
import { ProductService, AccountService, CompanyCategoryService, CompanyVariationService } from 'src/services';
import { ProductVariationService } from 'src/services/product-variation.service';
import { UxService } from 'src/services/ux.service';
import { COMPANY_TYPE, VARIATION_PRICE_MODES } from 'src/shared/constants';

@Component({
  selector: 'app-super-list-product',
  templateUrl: './super-list-product.component.html',
  styleUrls: ['./super-list-product.component.scss']
})
export class SuperListProductComponent implements OnInit {
  @Input() products: Product[];
  product: Product;
  newOption: ProductVariationOption;
  user: User;
  modalHeading = 'Add product';
  primaryAction = 'Add food item'
  addEditCompanyHeading = 'Add new food item';
  showModal: boolean;
  showAddCustomer: boolean;
  parentCategories: Category[];
  chilndrenCategories: Category[];
  categories: Category[];
  parentCategoryGuid = '';
  categoryGuid = '';
  search;
  allProducts: Product[];
  showLoader;
  companyId: any;
  usersItems: SliderWidgetModel[]
  showFilter = true;
  selectItem: SliderWidgetModel;
  option: VariationOption;
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
      this.companyId = r.id;
      this.getProducts();
    });
  }

  ngOnInit() {
    this.user = this.accountService.currentUserValue;
    if (!this.user) {
      return
    }
    this.usersItems = [];



    // this.companyVariationService.getAllVariations(COMPANY_TYPE).subscribe(data => {
    //   console.log(data);

    // })
  }

  getProducts() {
    this.productService.getProductsSync(this.companyId).subscribe(data => {
      this.products = data || [];
      this.products.forEach(product => {
        product.PriceFromLabel = '';
        if (product && product.ProductVariations) {
          product.ProductVariations.forEach(variation => {
            let basesPrices: number[] = [];
            if (variation.ProductVariationOptions && variation.ProductVariationOptions.length && variation.PriceMode === VARIATION_PRICE_MODES[0].Name) {
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
      this.loadListItems();

    })
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

  loadListItems() {
    if (this.products && this.products.length) {
      this.usersItems = [];
      this.products.forEach(item => {
        this.usersItems.push({
          Id: `${item.ProductId}`,
          Name: `${item.Name}`,
          Description: `${item.PriceFromLabel}R${item.RegularPrice} | ${item.CategoryName || 'No Catergory'}`,
          Link: `event`,
          Icon: item.FeaturedImageUrl
        })


      })
    }
  }
  selectCategory(categoryId: string) {
    if (categoryId === '') {
      this.products = this.allProducts;
      return true;
    }
    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      this.products = this.allProducts.filter(x => x.ParentCategoryGuid === categoryId);
      this.chilndrenCategories = this.categories.filter(x => x.ParentId === categoryId && Number(x.StatusId) === 1);
    }
  }


  selectSubCategory(categoryId: string) {
    if (categoryId === '') {
      this.products = this.allProducts.filter(x => x.ParentCategoryGuid === this.parentCategoryGuid);
      return true;
    }

    if (categoryId && categoryId.length) {
      if (categoryId.split(':').length === 2) {
        categoryId = categoryId.split(':')[1].trim();
      }
      this.products = this.allProducts.filter(
        x => x.ParentCategoryGuid === this.parentCategoryGuid
          && x.CategoryGuid === categoryId
      );
    }

  }
  view(product: Product) {
    this.productService.updateProductState(product);
    this.router.navigate([`/admin/dashboard/product/${product.ProductId}/${this.companyId}/1`]);
  }
  closeModal() {
    this.showModal = false;
    this.showAddCustomer = false;
  }
  add() {
    // this.router.navigate(['admin/dashboard/add-product']);
    this.productService.updateProductState(null);
    this.router.navigate([`admin/dashboard/product/add/${this.companyId}/1`]);

  }

  back() {
    this.router.navigate(['admin/dashboard/restaurant', this.companyId]);
  }

  onPrimaryActionEvent(event) {
    this.add();
  }


  OnItemSelected(item: SliderWidgetModel) {
    this.selectItem = item;
    const prod = this.products.find(x => x.ProductId === item.Id);
    if (prod) {
      // this.product = prod;
      // this.addEditCompanyHeading = 'View or edit food item'
      this.view(prod);
    }
  }

}
