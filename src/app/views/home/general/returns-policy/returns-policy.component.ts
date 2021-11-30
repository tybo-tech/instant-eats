import { Component, OnInit } from '@angular/core';
import { COMPANY_EMIAL } from 'src/shared/constants';

@Component({
  selector: 'app-returns-policy',
  templateUrl: './returns-policy.component.html',
  styleUrls: ['./returns-policy.component.scss']
})
export class ReturnsPolicyComponent implements OnInit {
  COMPANY_EMIAL = COMPANY_EMIAL.split(',')[0];
  constructor() { }

  ngOnInit() {
  }

}
