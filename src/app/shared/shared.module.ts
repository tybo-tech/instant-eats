import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListWidgetComponent } from '../views/dashboard/shared/card-list-widget/card-list-widget.component';
import { SearchSliderWidgetPipe } from '../_pipes/slider-widget.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NotificationsComponent } from './notifications/notifications.component';
import { DateformaterPipe } from './pipes/dateformater.pipe';
import { DistanceWidgetComponent } from './distance-widget/distance-widget.component';
import { MarkersComponent } from './markers/markers.component';
import { NavigateComponent } from './navigate/navigate.component';
import { ShowiratingsComponent } from './showiratings/showiratings.component';
import { RequestComponent } from '../views/home/driver/request/request.component';



@NgModule({
  declarations: [
    CardListWidgetComponent,
    SearchSliderWidgetPipe,
    NotificationsComponent,
    DateformaterPipe,
    DistanceWidgetComponent,
    MarkersComponent,
    NavigateComponent,
    ShowiratingsComponent,
    RequestComponent
  ],
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule ,
    ],
  exports: [
    CardListWidgetComponent,
    SearchSliderWidgetPipe,
    NotificationsComponent,
    DateformaterPipe,
    DistanceWidgetComponent,
    MarkersComponent,
    NavigateComponent,
    ShowiratingsComponent,
    RequestComponent
  ]
})
export class SharedModule { }
