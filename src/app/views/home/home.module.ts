import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule, declarations } from './home-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MaterialModule } from 'src/app/material';
// import { QuillModule } from 'ngx-quill';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ClipboardModule} from '@angular/cdk/clipboard';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AgmCoreModule } from '@agm/core';
import { CheckoutCustomerInfoComponent } from './cart/cart-items/checkout-customer-info/checkout-customer-info.component';
import { AltraCheckoutComponent } from './altra-checkout/altra-checkout.component';
import { AltraCheckoutCustomerComponent } from './altra-checkout/altra-checkout-customer/altra-checkout-customer.component';
import { AltraCheckoutCartComponent } from './altra-checkout/altra-checkout-cart/altra-checkout-cart.component';
import { AltraCheckoutPaymentsComponent } from './altra-checkout/altra-checkout-payments/altra-checkout-payments.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CheckoutTipComponent } from './cart/cart-items/checkout-tip/checkout-tip.component';
import { DriverDashboardComponent } from './driver/driver-dashboard/driver-dashboard.component';
import { OrderDriverComponent } from './driver/order-driver/order-driver.component';
import { RateDriverComponent } from './driver/rate-driver/rate-driver.component';
import {RatingModule} from 'primeng/rating';
import { DriverHistoryComponent } from './driver/driver-history/driver-history.component';

@NgModule({
  imports: [
    GooglePlaceModule,
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    ClipboardModule,
    CarouselModule,
    AgmCoreModule,
    RatingModule


    // QuillModule.forRoot()

  ],
  declarations: [...declarations, CheckoutCustomerInfoComponent, AltraCheckoutComponent, AltraCheckoutCustomerComponent, AltraCheckoutCartComponent, AltraCheckoutPaymentsComponent, CheckoutTipComponent, DriverDashboardComponent, OrderDriverComponent, RateDriverComponent, DriverHistoryComponent]
})
export class HomeModule { }


