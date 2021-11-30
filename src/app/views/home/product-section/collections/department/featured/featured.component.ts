import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models/product.model';
import { DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit {

  @Input() products;
  @Input() label;
  selectedProduct: Product;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.products && this.products.length) {
      this.products.forEach(product => {
        if (product && product.Company && product.Company.Promotions && product.Company.Promotions.length) {
          const promo = product.Company.Promotions[0];
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
      })
    }
  }
  viewMore(model: Product) {
    if (model) {
      this.selectedProduct = model;
      return
    }
  }
  gotoComapny(product: Product) {
    window.scroll(0, 0);
    if (product.Company) {
      this.router.navigate([product.Company.Slug || product.CompanyId]);
      return;
    }
    this.router.navigate([product.CompanyId]);
  }
}
