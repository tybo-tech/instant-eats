import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule, declarations } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { QuillModule } from 'ngx-quill';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AgmCoreModule } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AltraOrderComponent } from './orders/altra-order/altra-order.component';
import { FeeComponent } from './item/fees/fee/fee.component';
import { ReportsComponent } from './reports/reports/reports.component';
import {ChartModule} from 'primeng/chart';
import { AppConfigService } from 'src/services/appconfigservice';
import { EmailsComponent } from './item/emails/emails.component';

// import {ToastModule} from 'primeng/toast';



@NgModule({
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ]
,
  imports: [
    CommonModule,
    MatNativeDateModule,
    DashboardRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    // MaterialModule,
    MatSnackBarModule,
    MatChipsModule,
    MatBadgeModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GooglePlaceModule,
    ClipboardModule,
    MatSlideToggleModule,
    ImageCropperModule,
    AgmCoreModule,
    ChartModule,
    // ToastModule,
    QuillModule.forRoot()

  ],
  declarations: [...declarations, AltraOrderComponent, FeeComponent, ReportsComponent, EmailsComponent],
  providers: [AppConfigService]
})
export class DashboardModule { }
