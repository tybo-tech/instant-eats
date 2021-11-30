import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Product } from 'src/models';
import { OperatingHours } from 'src/models/operatinghours.model';


@Injectable({
  providedIn: 'root'
})
export class OperatingHoursService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }


  update(image: OperatingHours) {
    return this.http.post<OperatingHours>(
      `${this.url}/api/operatinghours/update-operatinghours.php`, image
    );
  }

  addRange(operatingHours: OperatingHours[]) {
    return this.http.post<OperatingHours[]>(
      `${this.url}/api/operatinghours/add-operatinghours-range.php`, operatingHours
    );
  }
  updateRange(operatingHours: OperatingHours[]) {
    return this.http.post<OperatingHours[]>(
      `${this.url}/api/operatinghours/update-operatinghours-range.php`, operatingHours
    );
  }

}
