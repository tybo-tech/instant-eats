import { Component, Input, OnInit } from '@angular/core';
import { Company } from 'src/models/company.model';
import { HOURS } from 'src/models/operatinghours.model';
import { OperatingHoursService } from 'src/services/operatinghours.service';
import { UxService } from 'src/services/ux.service';
import { OPEN_CLOSE } from 'src/shared/constants';

@Component({
  selector: 'app-operatinghours',
  templateUrl: './operatinghours.component.html',
  styleUrls: ['./operatinghours.component.scss']
})
export class OperatinghoursComponent implements OnInit {
  @Input() company: Company;
  OPEN_CLOSE = OPEN_CLOSE;
  constructor(
    private operatingHoursService: OperatingHoursService,
    private uxService: UxService,
  ) { }

  ngOnInit() {
    if (this.company.OperatingHours && this.company.OperatingHours.length) {

    } else {
      this.company.OperatingHours = HOURS;
      this.company.OperatingHours.map(x => x.CompanyId = this.company.CompanyId);
      this.save();
    }
  }
  save() {
    if (this.company.OperatingHours && this.company.OperatingHours.length) {
      if (this.company.OperatingHours[0].CreateDate) {
        this.operatingHoursService.updateRange(this.company.OperatingHours).subscribe(data => {
          if (data && data.length) {
            this.company.OperatingHours = data;
            this.uxService.showQuickMessage("Operating Hours Updated")
          }
        })
      } else {
        this.operatingHoursService.addRange(this.company.OperatingHours).subscribe(data => {
          if (data && data.length) {
            this.company.OperatingHours = data;
          }
        })
      }
    }

  }
}
