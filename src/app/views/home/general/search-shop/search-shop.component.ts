import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProductService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-search-shop',
  templateUrl: './search-shop.component.html',
  styleUrls: ['./search-shop.component.scss']
})
export class SearchShopComponent implements OnInit {
  searchString: string;
  label = "Explore our"
  results: any[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.uxService.searchStringObservable.subscribe(data => {
      this.searchString = data;
      this.searchNow();
    })
  }
  searchNow() {
    if (this.searchString && this.searchString.length > 2) {
      this.productService.searchProducts(this.searchString).subscribe(data => {
        console.log(data);
        this.results = data;

      })
    }
  }

  goto(slug) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/home/search',
      BackTo: '/home/search',
      ScrollToProduct: null
    });

    this.uxService.updateSearchStringState(this.searchString);
    this.router.navigate([`shop/product/${slug}`]);
  }
}
