import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/models';
import { CompanyCategoryService } from 'src/services/companycategory.service';

@Component({
  selector: 'app-shop-by-catergory',
  templateUrl: './shop-by-catergory.component.html',
  styleUrls: ['./shop-by-catergory.component.scss']
})
export class ShopByCatergoryComponent implements OnInit {
  allCategories: Category[];
  subCatergories: Category[];
  pcCatergories: Category[];
  @Input() parentId;
  @Input() label;
  starPick = 0;
  slideDone: boolean;

  constructor(private companyCategoryService: CompanyCategoryService, private router: Router) { }

  ngOnInit() {
    this.companyCategoryService.systemCategoryListObservable.subscribe(data => {
      if (data) {
        this.allCategories = data;
        this.subCatergories = this.allCategories.filter(x => x.ProductsImages && x.ProductsImages.length);
        if (this.parentId) {
          this.subCatergories = this.subCatergories.filter(x => x.ParentId === this.parentId);
        }
        this.starPick = 0;
        this.pcNext();
      }
    });
  }
  pcNext() {
    this.pcCatergories = [];
    for (let i = this.starPick; i <= this.starPick + 5; i++) {
      if (this.starPick < this.subCatergories.length - 1 && this.subCatergories[i]) {
        this.pcCatergories.push(this.subCatergories[i]);
      } else {
        this.slideDone = true;
      }
    }
    this.starPick = this.starPick + 6;
  }
  pcPrev() {
    this.pcCatergories = [];
    for (let i = this.starPick; i >= this.starPick; i--) {
      if (this.starPick >= 0 && this.subCatergories[i]) {
        this.pcCatergories.push(this.subCatergories[i]);
      } else {
        this.slideDone = true;
      }
    }
    this.starPick = this.starPick + 6;
  }
  goto(event) {
    this.router.navigate([event]);
  }

  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

  }
}
