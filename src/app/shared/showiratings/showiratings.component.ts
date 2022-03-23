import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-showiratings',
  templateUrl: './showiratings.component.html',
  styleUrls: ['./showiratings.component.scss']
})
export class ShowiratingsComponent implements OnInit {
  @Input() rate: number;
  @Input() DriverRatingNotes: number;
  rates = ['pi pi-star', 'pi pi-star', 'pi pi-star', 'pi pi-star', 'pi pi-star'];

  constructor() { }

  ngOnInit(): void {
    if (this.rate)
      this.clickRate(Number(this.rate) - 1)
  }
  clickRate(max: number) {

    // this.rates.forEach(x => x = 'pi pi-star');
    for (let i = 0; i < this.rates.length; i++) {
      this.rates[i] = 'pi pi-star';
    }
    for (let i = 0; i <= max; i++) {
      this.rates[i] = 'pi pi-star-fill';
    }


  }
}
