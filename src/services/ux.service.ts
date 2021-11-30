import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HomeNavUx, HomeTabModel, LoaderUx, LocationModel, NavHistoryUX, ProductsPagingModel } from 'src/models/UxModel.model';

@Injectable({
  providedIn: 'root'
})


export class UxService {


  private uxMessagePopBehaviorSubject: BehaviorSubject<string>;
  public uxMessagePopObservable: Observable<string>;

  private uxNavHistoryBehaviorSubject: BehaviorSubject<NavHistoryUX>;
  public uxNavHistoryObservable: Observable<NavHistoryUX>;

  private navBarLogoBehaviorSubject: BehaviorSubject<HomeNavUx>;
  public navBarLogoObservable: Observable<HomeNavUx>;

  private showIntroPageBehaviorSubject: BehaviorSubject<string>;
  public showIntroPageObservable: Observable<string>;

  private uxLoadingBehaviorSubject: BehaviorSubject<LoaderUx>;
  public uxLoadingPopObservable: Observable<LoaderUx>;

  private uxHomeSideNavBehaviorSubject: BehaviorSubject<boolean>;
  public uxHomeSideNavObservable: Observable<boolean>;

  private showQuickLoginBehaviorSubject: BehaviorSubject<boolean>;
  public showQuickLoginObservable: Observable<boolean>;


  private pageYPositionBehaviorSubject: BehaviorSubject<number>;
  public pageYPositionObservable: Observable<number>;


  private searchStringBehaviorSubject: BehaviorSubject<string>;
  public searchStringObservable: Observable<string>;

  private homeTabBehaviorSubject: BehaviorSubject<HomeTabModel>;
  public homeTabObservable: Observable<HomeTabModel>;

  private locationBehaviorSubject: BehaviorSubject<LocationModel>;
  public locationObservable: Observable<LocationModel>;


  private productsPagingModelBehaviorSubject: BehaviorSubject<ProductsPagingModel>;
  public productsPagingModelObservable: Observable<ProductsPagingModel>;

  constructor() {
    this.uxMessagePopBehaviorSubject = new BehaviorSubject<string>(null);
    this.uxMessagePopObservable = this.uxMessagePopBehaviorSubject.asObservable();

    this.uxLoadingBehaviorSubject = new BehaviorSubject<LoaderUx>(null);
    this.uxLoadingPopObservable = this.uxLoadingBehaviorSubject.asObservable();

    this.navBarLogoBehaviorSubject = new BehaviorSubject<HomeNavUx>(JSON.parse(localStorage.getItem('HomeNavUx')));
    this.navBarLogoObservable = this.navBarLogoBehaviorSubject.asObservable();

    this.showIntroPageBehaviorSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('ShowIntroPage')));
    this.showIntroPageObservable = this.showIntroPageBehaviorSubject.asObservable();


    this.uxNavHistoryBehaviorSubject = new BehaviorSubject<NavHistoryUX>(null);
    this.uxNavHistoryObservable = this.uxNavHistoryBehaviorSubject.asObservable();


    this.uxHomeSideNavBehaviorSubject = new BehaviorSubject<boolean>(null);
    this.uxHomeSideNavObservable = this.uxHomeSideNavBehaviorSubject.asObservable();

    this.showQuickLoginBehaviorSubject = new BehaviorSubject<boolean>(false);
    this.showQuickLoginObservable = this.showQuickLoginBehaviorSubject.asObservable();


    this.pageYPositionBehaviorSubject = new BehaviorSubject<number>(null);
    this.pageYPositionObservable = this.pageYPositionBehaviorSubject.asObservable();

    this.homeTabBehaviorSubject = new BehaviorSubject<HomeTabModel>(JSON.parse(localStorage.getItem('HomeTabState')));
    this.homeTabObservable = this.homeTabBehaviorSubject.asObservable();


    this.searchStringBehaviorSubject = new BehaviorSubject<string>(JSON.parse(localStorage.getItem('searchString')));
    this.searchStringObservable = this.searchStringBehaviorSubject.asObservable();

    this.locationBehaviorSubject = new BehaviorSubject<LocationModel>(JSON.parse(localStorage.getItem('location')));
    this.locationObservable = this.locationBehaviorSubject.asObservable();


    this.productsPagingModelBehaviorSubject = new BehaviorSubject<ProductsPagingModel>(
      JSON.parse(localStorage.getItem('productsPagingModel')) || { Page: 99999999 });
    this.productsPagingModelObservable = this.productsPagingModelBehaviorSubject.asObservable();

  }

  public get currentMessagePopValue(): string {
    return this.uxMessagePopBehaviorSubject.value;
  }

  public get currentNavBarLogoValue(): HomeNavUx {
    return this.navBarLogoBehaviorSubject.value;
  }
  public get getProductsPagingValue(): ProductsPagingModel {
    return this.productsPagingModelBehaviorSubject.value;
  }

  updatePageYPositionState(state: number) {
    if (state) {
      this.pageYPositionBehaviorSubject.next(state);
    }
  }
  updateSearchStringState(state: string) {
    this.searchStringBehaviorSubject.next(state);
    localStorage.setItem('searchString', JSON.stringify(state));
  }
  updateProductsPagingState(productsPagingModel: ProductsPagingModel) {
    this.productsPagingModelBehaviorSubject.next(productsPagingModel);
    // localStorage.setItem('productsPagingModel', JSON.stringify(productsPagingModel));
  }
  updateHomeTabModelState(state: HomeTabModel) {
    if (state) {
      this.homeTabBehaviorSubject.next(state);
      localStorage.setItem('HomeTabState', JSON.stringify(state));
    }
  }
  showQuickMessage(state: string) {
    if (state) {
      this.uxMessagePopBehaviorSubject.next(state);
    }
  }
  updateNavBarLogoState(state: HomeNavUx) {
    if (state) {
      this.navBarLogoBehaviorSubject.next(state);
      localStorage.setItem('HomeNavUx', JSON.stringify(state));
    }
  }
  updateLocationState(state: LocationModel) {
    if (state) {
      this.locationBehaviorSubject.next(state);
      localStorage.setItem('location', JSON.stringify(state));
    }
  }
  updateLoadingState(state: LoaderUx) {
    if (state) {
      this.uxLoadingBehaviorSubject.next(state);
    }
  }

  closeQuickLogin() {
    this.showQuickLoginBehaviorSubject.next(false);
  }
  openTheQuickLogin() {
    this.showQuickLoginBehaviorSubject.next(true);
  }
  hideLoader() {
    this.uxLoadingBehaviorSubject.next({ Loading: false, Message: undefined });
  }
  showLoader() {
    this.uxLoadingBehaviorSubject.next(({ Loading: true, Message: 'Loading, please wait.' }));
  }
  hideHomeSideNav() {
    this.uxHomeSideNavBehaviorSubject.next(false);
  }
  showHomeSideNav() {
    this.uxHomeSideNavBehaviorSubject.next(true);

  }
  keepNavHistory(item: NavHistoryUX) {
    this.uxNavHistoryBehaviorSubject.next(item);
  }
  setHistory(url) {
    this.keepNavHistory({
      BackToAfterLogin: url,
      BackTo: url,
      ScrollToProduct: null
    });
  }
  updateShowIntroPageState(state: string) {
    this.showIntroPageBehaviorSubject.next(state);
    localStorage.setItem('ShowIntroPage', JSON.stringify(state));
  }

  toRad(Value) {
    return Value * Math.PI / 180;
  }


  calcCrow(coords1: LocationModel, coords2: LocationModel) {
    // var R = 6.371; // km
    var R = 6371000;
    var dLat = this.toRad(coords2.lat - coords1.lat);
    var dLon = this.toRad(coords2.lng - coords1.lng);
    var lat1 = this.toRad(coords1.lat);
    var lat2 = this.toRad(coords2.lat);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d / 1000;
  }
}

