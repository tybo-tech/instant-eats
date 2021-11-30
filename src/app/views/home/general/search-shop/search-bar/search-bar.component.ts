import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/services';
import { UxService } from 'src/services/ux.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchString: string;
  label = "Explore our"
  results: any[] = [];
  showResults: boolean;

  constructor(
    private productService: ProductService,
    private router: Router,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    this.uxService.searchStringObservable.subscribe(data => {
      this.searchString = data;
      // this.searchNow();
    })
  }
  searchNow() {
    if (this.searchString && this.searchString.length > 2) {
      this.productService.searchProducts(this.searchString).subscribe(data => {
        console.log(data);
        this.results = data;
        this.showResults = true;

      })
    } else {
      this.results = [];
      this.showResults = false;
    this.uxService.updateSearchStringState(this.searchString);

    }
  }

  goto(slug) {
    this.uxService.keepNavHistory({
      BackToAfterLogin: '/home/search',
      BackTo: '/home/search',
      ScrollToProduct: null
    });

    this.showResults = false;
    this.uxService.updateSearchStringState(this.searchString);
    this.router.navigate([`shop/product/${slug}`]);
  }

}
