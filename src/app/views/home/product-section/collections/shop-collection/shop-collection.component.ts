import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, Category } from 'src/models';
import { HomeShopService } from 'src/services/home-shop.service';

@Component({
  selector: 'app-shop-collection',
  templateUrl: './shop-collection.component.html',
  styleUrls: ['./shop-collection.component.scss']
})
export class ShopCollectionComponent implements OnInit {

  product: Product;
  productSlug: string;
  totalPrice = 0;
  quantity = 0;
  catergoryId: string;
  catergory: Category;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private homeShopService: HomeShopService,
    private router: Router,
  ) {
    this.activatedRoute.params.subscribe(r => {
      this.catergoryId = r.id;
    });
  }

  ngOnInit() {
    this.homeShopService.categoryObservable.subscribe(data => {
      if (data) {
        this.catergory = data;
      } else {
        this.back();
      }
    })
  }


  updateTotalPrice(quantity) {
    if (!quantity) {
      quantity = 1;
    }
    this.quantity = quantity;
  }
  onNavItemClicked(p) { }
  back() {
    if(this.catergory && this.catergory.Products && this.catergory.Products.length){
      const model = this.catergory.Products[0];
      this.router.navigate([model.CompanyId]);
      return;
    }
    this.router.navigate(['']);
  }

  viewMore(product: Product) {
    if (product) {
      this.homeShopService.updateProductState(product);
      this.router.navigate(['shop/product', product.ProductSlug])
    }
  }
}
