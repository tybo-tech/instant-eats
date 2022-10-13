import { Component, OnInit, Input } from '@angular/core';
import { BASE } from 'src/environments/environment';
import { WebConfig, getConfig } from 'src/shared/web-config';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() showLoader: boolean;
  config: WebConfig;

  constructor() { }

  ngOnInit() {
    this.config = getConfig(BASE);

  }

}
