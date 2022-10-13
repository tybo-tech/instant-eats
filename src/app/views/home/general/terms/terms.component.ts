import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BASE } from 'src/environments/environment';
import { getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  label = "Explore our"
  config = getConfig(BASE);

  constructor(  private router: Router,
    ) { }

  ngOnInit() {
  }
  back() {
    this.router.navigate([``]);
  }
}
