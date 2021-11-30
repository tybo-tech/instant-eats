import { Product } from "./product.model";

export interface HomeNavUx {
  LogoUrl: string;
  Name: string;
}


export interface LoaderUx {
  Loading: boolean;
  Message?: string;
}
export interface NavHistoryUX {
  BackTo: string;
  BackToAfterLogin: string;
  ScrollToProduct: Product;
  ScrollToYPositoin?: number;
}

export interface BreadModel {
  Id?: string;
  Name: string;
  Link: string;
  Class?: string[];
}
export interface HomeTabModel {
  Name: string;
  Classes: string[];
  Class?: string;
}


export interface ProductsPagingModel {
  Page: number;
}
export interface LocationModel {
  lat: number;
  lng: number;
  addressLine: string
  formatedAddress?: string
  url: string
}
export interface SliderHomeWidgetModel {
  Id?:string;
  Name: string;
  Description?: string
  Image?: string;
  Link?:string;
  DeliveryTime?:string;
  MinimumOrder?:string;
  Warning?:string;

}


export interface SliderWidgetModel {
  Id?: string;
  Name: string;
  Description:string;
  Description2?:string;
  Link:string;
  Icon?:string;
  Selected?:boolean;
  Qty?: number;
  PaymentType?: string;
  Fee?: string;
  Status?: string;
  OrderStatus?: string;
  OrderNo?: string;
}



export interface AdminStatModel {
  Restaurants?:string;
  Categories?:string;
  Customers?:string;
  Products?:string;
  Users?:string;
  ActiveOrders?:string;
  HistoryOrders?:string;
  PendingOrders?:string;
  Promotions?:string;
  Drivers?:string;
  Admins?:string;
  Variations?:string;
}

export interface SearchResultModel {

  Id?: string
  CompanyId?: string
  Name: string
  Type: string
  Link?: string
  Icon?: string
  Children?: SearchResultModel[];
}