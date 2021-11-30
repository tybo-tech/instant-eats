import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SliderHomeWidgetModel } from 'src/models/UxModel.model';

@Component({
  selector: 'app-card-widget',
  templateUrl: './card-widget.component.html',
  styleUrls: ['./card-widget.component.scss']
})
export class CardWidgetComponent implements OnInit {
  @Input() item: SliderHomeWidgetModel;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goto(id) {
    this.router.navigate([id]);
  }
}
