import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeTabModel } from 'src/models/UxModel.model';
import { UxService } from 'src/services/ux.service';
import { TABS } from 'src/shared/constants';

@Component({
  selector: 'app-home-tabs',
  templateUrl: './home-tabs.component.html',
  styleUrls: ['./home-tabs.component.scss']
})
export class HomeTabsComponent implements OnInit {
  TABS = TABS;
  currentTab = TABS[0];
  constructor(
    private uxService: UxService,
    private router: Router
  ) { }

  ngOnInit() {
  }
  tab(item: HomeTabModel) {
    this.currentTab = item;
    this.TABS.map(x => x.Classes = []);
    item.Classes = ['active'];
    this.uxService.updateHomeTabModelState(item);
    window.scroll(0, 0);
    this.router.navigate([``]);
  }
}
