import { Component, OnInit } from '@angular/core';
import { BASE } from 'src/environments/environment';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-home-loader',
  templateUrl: './home-loader.component.html',
  styleUrls: ['./home-loader.component.scss']
})
export class HomeLoaderComponent implements OnInit {
  config: WebConfig;

  constructor() { }

  ngOnInit() {
    this.config = getConfig(BASE);

  }

}
