import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-buttin-spinner',
  templateUrl: './buttin-spinner.component.html',
  styleUrls: ['./buttin-spinner.component.scss']
})
export class ButtinSpinnerComponent implements OnInit {
  @Input() title = 'Loading';
  constructor() { }

  ngOnInit() {
  }

}
