import { Component, OnInit } from '@angular/core';
import { VERSION } from 'src/shared/constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
date = new Date();
  year: number;
  VERSION = VERSION;
  constructor() { }

  ngOnInit() {
    this.year = this.date.getFullYear();
  }

}
