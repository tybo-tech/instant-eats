import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/models';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-sliders',
  templateUrl: './section-sliders.component.html',
  styleUrls: ['./section-sliders.component.scss']
})
export class SectionSlidersComponent implements OnInit {
  @Input() items: Category[];

  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: [`<span class="material-icons btn-next-prev">chevron_left</span>`,`<span class="material-icons  btn-next-prev">navigate_next</span>`],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 4
      },
      940: {
        items: 6
      }
    },
    nav: true
  }

  constructor(private router: Router) { }

  ngOnInit() {
  }

  tapChildCategory(category: any) {
    if (category && category.CategoryId) {
      this.goto(`home/collections/${category.CategoryId}`);
      return;
    }

  }

  goto(event) {
    this.router.navigate([event]);
  }
}
