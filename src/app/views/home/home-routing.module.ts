import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from 'src/app/account/change-password/change-password.component';
import { EditMyProfileComponent } from 'src/app/account/edit-my-profile/edit-my-profile.component';
import { ForgotPasswordComponent, ResetPasswordComponent } from 'src/app/account/forgot-password';
import { MyProfileComponent } from 'src/app/account/my-profile/my-profile.component';
import { InviteComponent } from 'src/app/account/my-refferals/invite/invite.component';
import { MyRefferalsComponent } from 'src/app/account/my-refferals/my-refferals.component';
import { SignInComponent } from 'src/app/account/sign-in';
import { QuickSignInComponent } from 'src/app/account/sign-in/quick-sign-in/quick-sign-in.component';
import { SocialLoginComponent } from 'src/app/account/sign-in/social-login/social-login.component';
import { SignUpComponent } from 'src/app/account/sign-up';
import { SignUpModalComponent } from 'src/app/account/sign-up-modal/sign-up-modal.component';
import { SearchHomeSliderWidgetPipe } from 'src/app/_pipes/home-slider-widget.pipe';
import { PromotionTextPipe } from 'src/app/_pipes/promotionText.pipe';
import { SearchCompanyPipe } from 'src/app/_pipes/search-company.pipe';
import { SearchProductHomePipe } from 'src/app/_pipes/search-product-home.pipe';
import { TextarealinebreakpipePipe } from 'src/app/_pipes/textarealinebreakpipe.pipe';
import { HomeTopNavBarComponent } from '../dashboard/navigations/home-top-nav-bar/home-top-nav-bar.component';
import { MyOrdersComponent } from '../dashboard/orders/my-orders/my-orders.component';
import { CurrentOrderComponent } from '../dashboard/orders/view-order/current-order/current-order.component';
import { ProgressBarComponent } from '../dashboard/orders/view-order/current-order/progress-bar/progress-bar.component';
import { HistoryOrderComponent } from '../dashboard/orders/view-order/history-order/history-order.component';
import { OrderDriverDetailsComponent } from '../dashboard/orders/view-order/order-driver-details/order-driver-details.component';
import { ViewMyOrderComponent } from '../dashboard/orders/view-order/view-my-order/view-my-order.component';
import { ViewOrderComponent } from '../dashboard/orders/view-order/view-order.component';
import { AllShopsComponent } from './all-shops/all-shops.component';
import { ListShopsComponent } from './all-shops/list-shops/list-shops.component';
import { CartComponent, CheckoutComponent } from './cart';
import { CartItemsComponent } from './cart/cart-items/cart-items.component';
import { MyCartComponent } from './cart/my-cart/my-cart.component';
import { PaymentCancelledComponent } from './cart/payment-cancelled/payment-cancelled.component';
import { ShopingSuccesfulComponent } from './cart/shoping-succesful/shoping-succesful.component';
import { WishListComponent } from './cart/wish-list/wish-list.component';
import { CustomerFeedbackComponent } from './customer-feedback/customer-feedback.component';
import { DriverDashboardComponent } from './driver/driver-dashboard/driver-dashboard.component';
import { DriverHistoryComponent } from './driver/driver-history/driver-history.component';
import { RateDriverComponent } from './driver/rate-driver/rate-driver.component';
import { FiitingRoomComponent } from './fiiting-room/fiiting-room.component';
import { AboutComponent } from './general/about/about.component';
import { AddressWidgetComponent } from './general/address-widget/address-widget.component';
import { ButtinSpinnerComponent } from './general/buttin-spinner/buttin-spinner.component';
import { ContactComponent } from './general/contact/contact.component';
import { FloatingMenuComponent } from './general/floating-menu/floating-menu.component';
import { FooterComponent } from './general/footer/footer.component';
import { ReturnsPolicyComponent } from './general/returns-policy/returns-policy.component';
import { SearchBarComponent } from './general/search-shop/search-bar/search-bar.component';
import { SearchShopComponent } from './general/search-shop/search-shop.component';
import { TermsComponent } from './general/terms/terms.component';
import { HomeLandingComponent } from './home-landing';
import { CustomerDesignComponent } from './home-landing/customer-design/customer-design.component';
import { HelloPageComponent } from './home-landing/hello-page/hello-page.component';
import { HowItWorksComponent } from './home-landing/sell-with-us/how-it-works/how-it-works.component';
import { SellWithUsComponent } from './home-landing/sell-with-us/sell-with-us.component';
import { HomeNavComponent } from './home-nav';
import { HomeSideNavComponent } from './home-nav/home-side-nav/home-side-nav.component';
import { HomeTabsComponent } from './home-nav/home-tabs/home-tabs.component';
import { HomeUserTabsComponent } from './home-nav/home-user-tabs/home-user-tabs.component';
import { HomeToolbarNavigationComponent } from './home-toolbar-navigation/home-toolbar-navigation.component';
import { HomeComponent } from './home.component';
import { OrderDoneComponent } from './order-done/order-done.component';
import { ProductSectionCardComponent, ProductSectionComponent, ProductSectionDetailComponent } from './product-section';
import { AllCollectionsComponent } from './product-section/collections/all-collections/all-collections.component';
import { BreadComponent } from './product-section/collections/bread/bread.component';
import { ChatComponent } from './product-section/collections/chat/chat.component';
import { MessagesComponent } from './product-section/collections/chat/messages/messages.component';
import { CollectionsComponent } from './product-section/collections/collections.component';
import { DepartmentComponent } from './product-section/collections/department/department.component';
import { FeaturedComponent } from './product-section/collections/department/featured/featured.component';
import { ShopByGenderComponent } from './product-section/collections/department/shop-by-gender/shop-by-gender.component';
import { OnSaleComponent } from './product-section/collections/on-sale/on-sale.component';
import { ShopCollectionComponent } from './product-section/collections/shop-collection/shop-collection.component';
import { ProductQuickViewComponent } from './product-section/product-section-detail/product-quick-view/product-quick-view.component';
import { ProductSliderComponent } from './product-section/product-section-detail/product-slider/product-slider.component';
import { SectionSlidersComponent } from './product-section/product-section-detail/shop-by-catergory/section-sliders/section-sliders.component';
import { ShopByCatergoryComponent } from './product-section/product-section-detail/shop-by-catergory/shop-by-catergory.component';
import { HomeFullScreenLoadingComponent } from './shared/home-full-screen-loading/home-full-screen-loading.component';
import { HomeLoaderComponent } from './shared/home-loader/home-loader.component';
import { HomeWideCardWidgetComponent } from './shared/home-wide-card-widget/home-wide-card-widget.component';
import { QauntityWidgetComponent } from './shared/qauntity-widget/qauntity-widget.component';
import { SliderWidgetComponent } from './shared/slider-widget/slider-widget.component';
import { ShopComponent } from './shop';
import { ShopNavComponent } from './shop-nav/shop-nav.component';
import { ShopSideNavComponent } from './shop-nav/shop-side-nav/shop-side-nav.component';
import { SetUpShopComponent } from './shop/shop-products/set-up-shop/set-up-shop.component';
import { ShopProductsComponent } from './shop/shop-products/shop-products.component';
import { ShowPromotionsComponent } from './shop/shop-products/show-promotions/show-promotions.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: '', component: SellWithUsComponent } , //     for admin only,
      { path: '', component: ProductSectionComponent },
      // { path: ':id', component: ShopComponent },
      { path: 'restaurant/:id', component: ShopProductsComponent },
      { path: 'restaurant/:id/:productId', component: ShopProductsComponent },
      { path: 'farmer/:id', component: ShopProductsComponent },
      { path: 'farmer/:id/:productId', component: ShopProductsComponent },

      // { path: 'home/shop', component: HomeLandingComponent },
      { path: 'home/welcome', component: HelloPageComponent },
      { path: 'home/sign-in', component: SignInComponent },
      { path: 'home/start-shop', component: SignUpModalComponent },
      { path: 'home/sign-up', component: SignUpComponent },
      { path: 'home/custom-design', component: CustomerDesignComponent },
      // { path: 'shop/checkout', component: ShopingSuccesfulComponent }    for testing only,
      { path: 'shop/checkout', component: CheckoutComponent },
      { path: 'shop/cart', component: MyCartComponent },
      { path: 'home/forgot-password', component: ForgotPasswordComponent },
      { path: 'home/reset-password/:id', component: ResetPasswordComponent },
      { path: 'home/fitting-room', component: FiitingRoomComponent },
      { path: 'shop/product/:id', component: ProductSectionDetailComponent },
      { path: 'shop/collections/:id', component: ShopCollectionComponent },
      { path: 'home/category/:id', component: CollectionsComponent },
      { path: 'home/select-location', component: HomeLandingComponent },
      { path: 'home/all-collections/:id', component: AllCollectionsComponent },
      { path: 'home/hello-fashion-shop', component: SellWithUsComponent },
      { path: 'home/shops', component: ListShopsComponent },
      { path: 'home/payment-cancelled/:id', component: PaymentCancelledComponent },
      // { path: 'home/payment-cancelled/:id', component: ShopingSuccesfulComponent },  //    for testing only,
      { path: 'home/shopping-succesful/:id', component: ShopingSuccesfulComponent },  // form prod
      { path: 'home/profile', component: MyProfileComponent },
      { path: 'home/edit-myprofile', component: EditMyProfileComponent },
      { path: 'home/my-orders', component: MyOrdersComponent },
      { path: 'home/on-sale', component: OnSaleComponent },
      { path: 'home/wishlist', component: WishListComponent },
      { path: 'private/order-details/:id', component: ViewOrderComponent },
      { path: 'home/view-my-order/:id', component: ViewMyOrderComponent },
      { path: 'home/order-done/:id', component: OrderDoneComponent },
      { path: 'home/shop-for/:id', component: DepartmentComponent },
      { path: 'home/change-password/:id', component: ChangePasswordComponent },
      { path: 'home/chat/:id/:userId/:userToId', component: ChatComponent },
      { path: 'home/messages/:traceId/:targetId', component: MessagesComponent },
      
      //general
      
      { path: 'home/contact-us', component: ContactComponent },
      { path: 'home/about', component: AboutComponent },
      { path: 'home/terms', component: TermsComponent },
      { path: 'home/returns-policy', component: ReturnsPolicyComponent },
      { path: 'home/how-it-works', component: HowItWorksComponent },
      { path: 'home/search', component: SearchShopComponent },
      { path: 'home/my-refferals', component: MyRefferalsComponent },
      { path: 'home/invite/:id', component: InviteComponent },
      { path: 'home/chat/:id', component: ChatComponent },
      { path: 'home/rate/:id', component: RateDriverComponent },
      { path: 'driver/dashboard', component: DriverDashboardComponent },
      { path: 'driver/history', component: DriverHistoryComponent },
      { path: 'driver/dashboard/:id', component: DriverDashboardComponent },
      

    ]

    // { path: '', component: FiitingRoomComponent },
  }
];

export const declarations = [
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  ResetPasswordComponent,
  HomeComponent,
  HomeLandingComponent,
  HomeNavComponent,
  ShopComponent,
  ProductSectionComponent,
  ProductSectionDetailComponent,
  FiitingRoomComponent,
  ProductSectionCardComponent,
  HomeToolbarNavigationComponent,
  CartComponent,
  CheckoutComponent,
  CollectionsComponent,
  SellWithUsComponent,
  SignUpModalComponent,
  HowItWorksComponent,
  AllShopsComponent,
  ContactComponent,
  ShopingSuccesfulComponent,
  PaymentCancelledComponent,
  CartItemsComponent,
  CustomerFeedbackComponent,
  MyProfileComponent,
  EditMyProfileComponent,
  MyOrdersComponent,
  HomeSideNavComponent,
  ShopSideNavComponent,
  ShopNavComponent,
  ShopProductsComponent,
  ShopCollectionComponent,
  MyCartComponent,
  HelloPageComponent,
  CustomerDesignComponent,
  OnSaleComponent,
  SocialLoginComponent,
  AllCollectionsComponent,
  WishListComponent,
  ViewOrderComponent,
  ViewMyOrderComponent,
  DepartmentComponent,
  BreadComponent,
  ChatComponent,
  MessagesComponent,
  TextarealinebreakpipePipe,
  ProductSliderComponent,
  ShowPromotionsComponent,
  PromotionTextPipe,
  SearchCompanyPipe,
  SearchProductHomePipe,
  ShopByCatergoryComponent,
  ProductQuickViewComponent,
  ReturnsPolicyComponent,
  AboutComponent,
  TermsComponent,
  FooterComponent,
  FeaturedComponent,
  ShopByGenderComponent,
  QuickSignInComponent,
  ButtinSpinnerComponent,
  FloatingMenuComponent,
  SearchShopComponent,
  MyRefferalsComponent,
  InviteComponent,
  ListShopsComponent,
  SetUpShopComponent,
  SearchBarComponent,
  HomeTabsComponent,
  HomeUserTabsComponent,
  SectionSlidersComponent,
  AddressWidgetComponent,
  HomeTopNavBarComponent,
  SliderWidgetComponent,
  HomeWideCardWidgetComponent,
  SearchHomeSliderWidgetPipe,
  QauntityWidgetComponent,
  OrderDoneComponent,
  HomeLoaderComponent,
  HomeFullScreenLoadingComponent,
  ChangePasswordComponent,
  CurrentOrderComponent,
  HistoryOrderComponent,
  ProgressBarComponent,
  OrderDriverDetailsComponent
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
