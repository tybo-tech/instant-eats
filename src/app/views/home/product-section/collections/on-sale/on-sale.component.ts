import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/models';
import { Company } from 'src/models/company.model';
import { Promotion } from 'src/models/promotion.model';
import { CompanyService } from 'src/services/company.service';
import { HomeShopService } from 'src/services/home-shop.service';
import { PromotionService } from 'src/services/promotion.service';
import { DISCOUNT_TYPES } from 'src/shared/constants';

@Component({
  selector: 'app-on-sale',
  templateUrl: './on-sale.component.html',
  styleUrls: ['./on-sale.component.scss']
})
export class OnSaleComponent implements OnInit {

  shops: Company[];
  productsOnSale: Product[] = [];
  showLoader: boolean = true;
  @Output() navAction: EventEmitter<boolean> = new EventEmitter<boolean>();
  promotions: Promotion[];
  DISCOUNT_TYPES = DISCOUNT_TYPES;
  selectedProduct: Product;
  constructor(
    private router: Router,
    private companyService: CompanyService,
    private homeShopService: HomeShopService,
    private promotionService: PromotionService,


  ) { }

  ngOnInit() {
    this.promotionService.getAllActivePromotions().subscribe(data => {
      this.promotions = data || [];
      this.productsOnSale = [];
      this.promotions.forEach(promo => {
        if (promo && promo.Products) {
          promo.Products.forEach(product => {
            if (promo.PromoType === this.DISCOUNT_TYPES[0]) {
              product.SalePrice = (Number(product.RegularPrice) * (Number(promo.DiscountValue)/100));
              product.SalePrice = (Number(product.RegularPrice) - (Number(product.SalePrice)));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }
            if (promo.PromoType === this.DISCOUNT_TYPES[1]) {
              product.SalePrice = (Number(product.RegularPrice) - (Number(promo.DiscountValue)));
              product.Sale = `${promo.DiscountValue} ${promo.DiscountUnits}`
            }
            this.productsOnSale.push(product);
          })
        }
      });
    });
  }

  back() {
    // this.navAction.emit(true);
    this.router.navigate(['']);
  }

  viewMore(model: Product) {
    if (model) {
      this.selectedProduct = model;
      return
    }
  }
 
  gotoShopPromotion(promotion: Promotion) {
    this.router.navigate([promotion.CompanyId]);
  }
}
