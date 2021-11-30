import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoaderComponent } from 'src/app/shared_components/loader/loader.component';
import { ImagesComponent } from 'src/shared/components/images/images.component';
import { SetUpCompanyCategoriesComponent } from './categories/set-up-company-categories/set-up-company-categories.component';
import { SetUpCompanySubCategoriesComponent } from './categories/set-up-company-categories/set-up-company-sub-categories/set-up-company-sub-categories.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { CustomerComponent } from './customers/customer/customer.component';
import { CustomersComponent } from './customers/customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddJobCardComponent } from './jobs/add-job-card/add-job-card.component';
import { AddJobWorkItemComponent } from './jobs/add-job-work-item/add-job-work-item.component';
import { JobCardsComponent } from './jobs/job-cards/job-cards.component';
import { JobWorkListComponent } from './jobs/job-work-list/job-work-list.component';
import { VeiwJobCardComponent } from './jobs/veiw-job-card/veiw-job-card.component';
import { DashNavComponent } from './navigations/dash-nav/dash-nav.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { ItemSelectorComponent } from './orders/item-selector/item-selector.component';
import { ListOrdersComponent } from './orders/list-orders/list-orders.component';
import { OrderComponent } from './orders/order/order.component';
import { OverviewComponent } from './overview/overview.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ProductComponent } from './products/product/product.component';
import { SuperCategoriesComponent } from './super/category/super-categories/super-categories.component';
import { SuperCategoryComponent } from './super/category/super-category/super-category.component';
import { SuperAddAditCategoryComponent } from './super/category/super-add-adit-category/super-add-adit-category.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { ProductCombinationsComponent } from './variation/product-combinations/product-combinations.component';
import { SetUpCompanyVariationOptionsComponent } from './variation/set-up-company-variation-options/set-up-company-variation-options.component';
import { SetUpCompanyVariationsComponent } from './variation/set-up-company-variations/set-up-company-variations.component';
import { SuperCompaniesComponent } from './super/super-companies/super-companies.component';
import { SuperVariationsComponent } from './super/super-variations/super-variations.component';
import { SuperVariationOptionsComponent } from './super/super-variations-options/super-variation-options.component';
import { CompanyProfileComponent } from './company/company-profile/company-profile.component';
import { SearchProductPipe } from 'src/app/_pipes/search-product.pipe';
import { EditUserProfileComponent } from './customers/customer/edit-user-profile/edit-user-profile.component';
import { UserProfileComponent } from './customers/user-profile/user-profile.component';
import { CustomerSelectorComponent } from './orders/customer-selector/customer-selector.component';
import { OrderCartComponent } from './orders/order-cart/order-cart.component';
import { SuperOverviewComponent } from './overview/super-overview/super-overview.component';
import { OrderTrackingComponent } from './orders/order-tracking/order-tracking.component';
import { ShippingComponent } from './company/shipping/shipping.component';
import { PendingCustomDesignsComponent } from './custom-designs/pending-custom-designs/pending-custom-designs.component';
import { ViewCustomRequestComponent } from './custom-designs/view-custom-request/view-custom-request.component';
import { CompanyProfileLogoComponent } from './company/company-profile/company-profile-logo/company-profile-logo.component';
import { SuperListProductComponent } from './products/list-products/super-list-product/super-list-product.component';
import { JobEstimateComponent } from './jobs/veiw-job-card/job-estimate/job-estimate.component';
import { ViewInvoiceComponent } from './jobs/veiw-job-card/view-invoice/view-invoice.component';
import { AddPromotionComponent } from './promotion/add-promotion/add-promotion.component';
import { PromotionsComponent } from './promotion/promotions/promotions.component';
import { JobItemComponent } from './jobs/job-item/job-item.component';
import { SuperCompanyPageComponent } from './super/super-companies/super-company-page/super-company-page.component';
import { AllUsersComponent } from './users/all-users/all-users.component';
import { SuperProductsPicksComponent } from './super/category/super-products-picks/super-products-picks.component';
import { SuperPickDetailsComponent } from './super/category/super-products-picks/super-pick-details/super-pick-details.component';
import { Overviewv2Component } from './overview/overviewv2/overviewv2.component';
import { StatisticsComponent } from './overview/overviewv2/statistics/statistics.component';
import { ProductListCardsComponent } from './products/product-list-cards/product-list-cards.component';
import { DashbreadComponent } from '../home/product-section/collections/bread/dashbread/dashbread.component';
import { CardListWidgetComponent } from './shared/card-list-widget/card-list-widget.component';
import { SearchSliderWidgetPipe } from 'src/app/_pipes/slider-widget.pipe';
import { DashboardTopBarComponent } from './navigations/dashboard-top-bar/dashboard-top-bar.component';
import { ImageWidgetComponent } from './shared/image-widget/image-widget.component';
import { NodataWidgetComponent } from './shared/nodata-widget/nodata-widget.component';
import { AddressWidgetDashboardComponent } from '../home/general/address-widget/address-widget-dashboard/address-widget-dashboard.component';
import { DashTabsWidgetComponent } from './shared/dash-tabs-widget/dash-tabs-widget.component';
import { AddViewCompanyWidgetComponent } from './super/super-companies/add-view-company-widget/add-view-company-widget.component';
import { DashLoaderComponent } from './super/dash-loader/dash-loader.component';
import { OrderWidgetComponent } from './orders/list-orders/order-widget/order-widget.component';
import { RestaurantComponent } from './super/super-companies/restaurant/restaurant.component';
import { DeliveriesComponent } from './deliveries/deliveries/deliveries.component';
import { DeliveryWidgetComponent } from './deliveries/delivery-widget/delivery-widget.component';
import { CompanyUsersComponent } from './super/super-companies/restaurant/company-users/company-users.component';
import { ImageBannerWidgetComponent } from './shared/image-widget/image-banner-widget/image-banner-widget.component';
import { MylocationComponent } from '../home/general/address-widget/mylocation/mylocation.component';
import { OperatinghoursComponent } from './super/super-companies/operatinghours/operatinghours.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      // { path: '', component: OverviewComponent },
      { path: '', component: Overviewv2Component },
      // { path: '', component: ListProductsComponent },
      { path: 'customer/:id', component: CustomerComponent },
      { path: 'product/:id/:companyId/:tab', component: ProductComponent },
      { path: 'order/:id', component: OrderComponent },
      { path: 'create-order', component: CreateOrderComponent },
      { path: 'products/:id', component: SuperListProductComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'invoices/:status/:id', component: ListOrdersComponent },
      { path: 'set-up-company-categories', component: SetUpCompanyCategoriesComponent },
      { path: 'set-up-company-sub-categories', component: SetUpCompanySubCategoriesComponent },
      { path: 'set-up-company-variations', component: SetUpCompanyVariationsComponent },
      { path: 'set-up-company-variation-options', component: SetUpCompanyVariationOptionsComponent },
      { path: 'add-product', component: AddProductComponent },
      { path: 'product-combinations/:id', component: ProductCombinationsComponent },
      { path: 'jobs', component: JobCardsComponent },
      { path: 'job-card/:id', component: VeiwJobCardComponent },

      { path: 'restaurants', component: SuperCompaniesComponent },
      { path: 'restaurant/:id', component: RestaurantComponent },
      { path: 'categories', component: SuperCategoriesComponent },
      { path: 'all-products', component: SuperListProductComponent },

      { path: 'super-category/:id', component: SuperCategoryComponent },
      { path: 'super-company-page/:id', component: SuperCompanyPageComponent },
      { path: 'variations', component: SuperVariationsComponent },
      { path: 'super-variation-options/:id', component: SuperVariationOptionsComponent },
      { path: 'company-profile', component: CompanyProfileComponent },
      { path: 'user-profile', component: UserProfileComponent },
      { path: 'edit-user-profile', component: EditUserProfileComponent },
      { path: 'shipping', component: ShippingComponent },
      { path: 'pending-custom-designs', component: PendingCustomDesignsComponent },
      { path: 'custom-design/:id', component: ViewCustomRequestComponent },
      { path: 'upload-company-logo', component: CompanyProfileLogoComponent },
      { path: 'job-estimate/:id', component: JobEstimateComponent },
      { path: 'view-invoice/:id/:type', component: ViewInvoiceComponent },
      { path: 'promotion/:id', component: AddPromotionComponent },
      { path: 'promotions', component: PromotionsComponent },
      { path: 'all-users/:type', component: AllUsersComponent },
      { path: 'super-products-picks', component: SuperProductsPicksComponent },
      { path: 'super-pick/:id', component: SuperPickDetailsComponent },
      { path: 'deliveries/:id', component: DeliveriesComponent },
      { path: 'company-users/:id', component: CompanyUsersComponent },
      { path: 'company/:id', component: AddViewCompanyWidgetComponent },
    ]
  }
];
export const declarations: Array<any> = [
  DashboardComponent,
  LoaderComponent,
  CustomerComponent,
  CustomersComponent,
  ListProductsComponent,
  ProductComponent,
  UserProfileComponent,
  ImagesComponent,
  ListOrdersComponent,
  OrderComponent,
  CreateOrderComponent,
  ItemSelectorComponent,
  DashNavComponent,
  OverviewComponent,
  SetUpCompanyCategoriesComponent,
  SetUpCompanySubCategoriesComponent,
  SetUpCompanyVariationsComponent,
  SetUpCompanyVariationOptionsComponent,
  UserFeedbackComponent,
  AddProductComponent,
  ProductCombinationsComponent,
  JobCardsComponent,
  AddJobCardComponent,
  VeiwJobCardComponent,
  JobWorkListComponent,
  AddJobWorkItemComponent,
  AddCustomerComponent,
  SuperCategoriesComponent,
  SuperCategoryComponent,
  SuperAddAditCategoryComponent,
  SuperCompaniesComponent,
  SuperVariationsComponent,
  SuperVariationOptionsComponent,
  CompanyProfileComponent,
  UserFeedbackComponent,
  UserProfileComponent,
  EditUserProfileComponent,
  CustomerSelectorComponent,
  OrderCartComponent,
  SuperOverviewComponent,
  OrderTrackingComponent,
  ImagesComponent,
  PendingCustomDesignsComponent,
  ViewCustomRequestComponent,
  ShippingComponent,
  CompanyProfileLogoComponent,
  SuperListProductComponent,
  JobEstimateComponent,
  ViewInvoiceComponent,
  AddPromotionComponent,
  PromotionsComponent,
  JobItemComponent,
  SuperCompanyPageComponent,
  AllUsersComponent,
  SuperProductsPicksComponent,
  SuperPickDetailsComponent,
  AddressWidgetDashboardComponent,
  DashTabsWidgetComponent,
  AddViewCompanyWidgetComponent,
  DashLoaderComponent,
  RestaurantComponent,
  ImageBannerWidgetComponent,
  // pipes
  SearchProductPipe,
  Overviewv2Component,
  StatisticsComponent,
  ProductListCardsComponent,
  DashbreadComponent,
  CardListWidgetComponent,
  SearchSliderWidgetPipe,
  DashboardTopBarComponent,
  ImageWidgetComponent,
  NodataWidgetComponent,
  OrderWidgetComponent,
  DeliveriesComponent,
  DeliveryWidgetComponent,
  CompanyUsersComponent,
  MylocationComponent,
  OperatinghoursComponent

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { } 

