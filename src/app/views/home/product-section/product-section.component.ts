import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category, Product, User } from 'src/models';
import { Company } from 'src/models/company.model';
import { LocationModel, SearchResultModel, SliderHomeWidgetModel } from 'src/models/UxModel.model';
import { AccountService } from 'src/services';
import { CompanyService } from 'src/services/company.service';
import { InteractionService } from 'src/services/Interaction.service';
import { UxService } from 'src/services/ux.service';
import { DELIVERY_MODES, OPEN_CLOSE } from 'src/shared/constants';


@Component({
  selector: 'app-product-section',
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.scss']
})
export class ProductSectionComponent implements OnInit {
  pickup = 'secondary';
  delivery = 'primary';
  loading = true;
  locationData: LocationModel;
  locations: Company[];
  shopsNearByIds: string[];
  productsNearByIds: string[];
  categoriesNearByIds: string[];
  shopsItems: SliderHomeWidgetModel[];
  productsItems: SliderHomeWidgetModel[];
  categoriesItems: SliderHomeWidgetModel[];
  catergoryHeading = 'Catergory'
  popularFoodHeading = 'Popular food'
  restaurantsHeading = 'Restaurants'
  restaurants: Company[] = [];
  searchResutls: SearchResultModel[] = [];
  user: User;
  freeImage = true;
  hideLabel = true;
  DELIVERY_MODES = DELIVERY_MODES;
  searchString: string;
  categories: Category[];
  products: Product[];
  constructor(
    private uxService: UxService,
    private router: Router,
    private accountService: AccountService,
    private companyService: CompanyService,
    private interactionService: InteractionService,

  ) {
  }

  ngOnInit() {
    this.accountService.user.subscribe(data => {
      this.user = data;
    })
    this.interactionService.logHomePage(this.user, 'home page');




    this.uxService.locationObservable.subscribe(data => {
      this.locationData = data;
      if (this.locationData) {
        this.companyService.getLocations().subscribe(location => {
          this.loading = false;
          if (location && location.length) {
            this.locations = location;
            this.shopsNearByIds = [];
            this.locations.forEach(company => {
              const cord1: LocationModel = {
                lat: company.Latitude,
                lng: company.Longitude,
                addressLine: ``,
                url: ``
              }
              const distance = this.uxService.calcCrow(cord1, this.locationData);
              if (distance <= Number(company.Radius)) {
                this.shopsNearByIds.push(company.CompanyId);
              }
            })
            if (this.shopsNearByIds && this.shopsNearByIds.length) {
              this.getNearBy();
            } else {
              alert("Opps no restaurants  found near you.")
            }
          }
        })
      } else {
        this.goto(`home/welcome`)
      }
    })
  }

  getNearBy() {
    this.loading = true;
    this.products = [];
    this.companyService.getNearBy(this.shopsNearByIds).subscribe(data => {
      this.loading = false;
      if (data && data.length) {
        this.productsNearByIds = [];
        this.categoriesNearByIds = [];
        this.restaurants = data;
        this.restaurants.forEach(res => {
          res.Products.forEach(prod => {
            this.products.push(prod);
          })
        })
        this.restaurantsHeading
        this.setUpRestrantListWdget(data);
        this.categoriesNearByIds;
        data.forEach(item => {
          item.CategoryIds?.forEach(guid => {
            if (!this.categoriesNearByIds.find(x => x === guid.CategoryGuid)) {
              this.categoriesNearByIds.push(guid.CategoryGuid)
            }
          });
        });
        this.getCategories();

        // this.getProducts();
      }

    });
  }

  search() {
    this.searchResutls = [];

    if (!this.searchString || this.searchString.length < 2) {
      return;
    }

    const results = this.restaurants.filter(x => x.Name.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase()));
    if (results && results.length) {
      const res: SearchResultModel = {
        Name: 'Restaurants:',
        Type: 'Parent:',
        Children: []
      }

      results.forEach(x => {
        res.Children.push({
          Id: x.CompanyId,
          Name: x.Name,
          Type: 'restaurant',
        });
      })
      this.searchResutls.push(res);
    }

    const products = this.products.filter(x => x.Name.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase()));
    if (products && products.length) {
      const pro: SearchResultModel = {
        Name: 'Products:',
        Type: 'Parent:',
        Children: []
      }

      products.forEach(x => {
        pro.Children.push({
          Id: x.ProductId,
          CompanyId: x.CompanyId,
          Name: x.Name,
          Type: 'product',
        });
      })
      this.searchResutls.push(pro);
    }

    const categories = this.categories.filter(x => x.Name.toLocaleLowerCase().includes(this.searchString.toLocaleLowerCase()));
    if (categories && categories.length) {
      const cat: SearchResultModel = {
        Name: 'Cuisines:',
        Type: 'Parent:',
        Children: []
      }

      categories.forEach(x => {
        cat.Children.push({
          Id: x.CategoryId,
          Name: x.Name,
          Type: 'cuisine',
        });
      })
      this.searchResutls.push(cat);
    }
  }

  searchClicked(item: SearchResultModel) {
    if (item.Type === 'product') {
      this.router.navigate([`restaurant/${item.CompanyId}/${item.Id}`])
    }

    if (item.Type === 'restaurant') {
      this.router.navigate([`restaurant/${item.Id}`])
    }


    if (item.Type === 'cuisine') {
      const cat = this.categories.find(x => x.CategoryId === item.Id);
      if (cat) {
        const filtered = this.restaurants.filter(x => x.CategoryIds.map(x => x.CategoryGuid).toString().includes(cat.CategoryId));
        this.setUpRestrantListWdget(filtered);
      }
    } this.searchString = '';
  }
  setUpRestrantListWdget(data) {
    this.shopsItems = [];
    data.forEach(item => {
      this.shopsItems.push({
        Image: item.Dp,
        Name: item.Name,
        Link: `restaurant/${item.CompanyId}`,
        MinimumOrder: `${item.MinimumOrder}`,
        DeliveryTime: `${item.DeliveryTime}`,
        Description: `${item.AddressLine && item.AddressLine.substring(0, 33) || 'No Address.'}... `,
        Warning: this.companyService.getWarning(item)
      });

      this.productsNearByIds.push(item.CompanyId);
    });
  }

  getTime = time => new Date(2021, 9, 2, time.substring(0, 2), time.substring(3, 5), 0, 0);
  getProducts() {
    this.companyService.getProductsNearBy(this.productsNearByIds).subscribe(data => {
      console.log(data);
      if (data && data.length) {
        this.categoriesNearByIds = [];
        this.productsItems = [];
        data.forEach(item => {
          this.productsItems.push({
            Image: item.FeaturedImageUrl,
            Name: item.Name,
            Link: `shop/product/${item.ProductSlug}`

          });
          this.categoriesNearByIds.push(item.CategoryGuid);

        });
        this.getCategories();
      }

    });
  }
  getCategories() {
    if (!this.categoriesNearByIds || !this.categoriesNearByIds.length) {
      return;
    }
    this.companyService.getCategoriesNearBy(this.categoriesNearByIds).subscribe(data => {
      if (data && data.length) {
        this.categoriesItems = [];
        this.categories = data;
        data.forEach(item => {
          this.categoriesItems.push({
            Id: item.CategoryId,
            Image: item.ImageUrl,
            Name: item.Name,
            Link: `event`
          })
        })
      }

    });
  }

  goto(url) {
    this.router.navigate([url]);
  }

  sell() {
    this.router.navigate(['home/hello-fashion-shop'])
  }
  onItemSelectedEvent(event: SliderHomeWidgetModel) {
    if (event) {
      this.router.navigate([`${event.Link}`])
    }
  }

  switchPickUpMode(mode: string) {
    this.swithBtnColr(mode);
    const filtered = this.restaurants.filter(x => x.DeliveryMode === mode || x.DeliveryMode === this.DELIVERY_MODES[0]);
    this.setUpRestrantListWdget(filtered);

  }

  swithBtnColr(mode) {
    if (mode == this.DELIVERY_MODES[1]) { // pick
      this.pickup = 'primary';
      this.delivery = 'secondary';

    }
    if (mode == this.DELIVERY_MODES[2]) { // del
      this.pickup = 'secondary';
      this.delivery = 'primary';
    }
  }

  onItemClickedEvent(event: SliderHomeWidgetModel) {
    const cat = this.categories.find(x => x.CategoryId === event.Id);
    if (cat) {
      // console.log(this.restaurants[0].CategoryIds.map(x=>x.CategoryGuid).toString());

      const filtered = this.restaurants.filter(x => x.CategoryIds.map(x => x.CategoryGuid).toString().includes(cat.CategoryId));
      this.setUpRestrantListWdget(filtered);
    }
  }
}
