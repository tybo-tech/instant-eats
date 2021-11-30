import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CompanyCategory } from 'src/models/company.category.model';
import { Product } from 'src/models';
import { Delivery } from 'src/models/delivery.model';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {



  url: string;

  constructor(
    private http: HttpClient
  ) {

    this.url = environment.API_URL;
  }

  update(image: Delivery) {
    return this.http.post<Delivery>(
      `${this.url}/api/delivery/update-delivery.php`, image
    );
  }
  updateRange(Delivery: Delivery[]) {
    return this.http.post<Product>(
      `${this.url}/api/delivery/update-image-range.php`, Delivery
    );
  }
  addRange(Delivery: Delivery[]) {
    return this.http.post<Product>(
      `${this.url}/api/delivery/add-image-range.php`, Delivery
    );
  }
  add(company: Delivery) {
    return this.http.post<Delivery>(
      `${this.url}/api/delivery/add-delivery.php`, company
    );
  }


  getNearBy(latitude: number, longitude: number, radius: number, driverId:string) {
    return this.http.get<Delivery[]>(
      `${this.url}/api/delivery/get-deliveries-near-by.php?Radius=${radius}&Latitude=${latitude}&Longitude=${longitude}&DriverId=${driverId}`
    );
  }


  getByDriverIdOtherId(driverId: string, statusId:number) {
    return this.http.get<Delivery[]>(`${this.url}/api/delivery/get-deliveries-for-driver.php?DriverId=${driverId}&StatusId=${statusId}`)
  }


}
