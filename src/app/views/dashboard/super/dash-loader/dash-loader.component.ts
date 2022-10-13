import { Component, OnInit } from '@angular/core';
import { BASE } from 'src/environments/environment';
import { getConfig, WebConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-dash-loader',
  templateUrl: './dash-loader.component.html',
  styleUrls: ['./dash-loader.component.scss']
})
export class DashLoaderComponent implements OnInit {
  config: WebConfig;

  constructor() { }

  ngOnInit() {
    this.config = getConfig(BASE);

  }

}
