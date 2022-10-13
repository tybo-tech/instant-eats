import { Company } from './company.model';
import { Customer } from './customer.model';
import { Delivery } from './delivery.model';
import { Item } from './item.model';
import { Orderproduct } from './order.product.model';
import { Promotion } from './promotion.model';
import { User } from './user.model';


export interface Order {
  Id?: string;
  OrdersId: string;
  OrderNo: string;
  CompanyId: string;
  CustomerId: string;
  CustomerName?: string;
  CustomerSurname?: string;
  CustomerEmail?: string;
  CustomerPhone?: string;
  Latitude?: number;
  Longitude?: number;
  AddressNumber?: string;
  AddressType?: string;
  AddressName?: string;
  FullAddress?: string;
  AddressId: string;
  Notes: string;
  OrderType: string;
  ItemsTotal?: number;
  CartItems?: number;
  ServiceFee?: number;
  Total: number;
  Shipping?: string;
  ShippingPrice?: number;
  Paid: number;
  Due: number;
  InvoiceDate: Date;
  DueDate: string;
  EstimatedDeliveryDate?: any;
  MaxDeliveryTime?: any;
  OrderSource?: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  Status: string;
  StatusId: number;
  Orderproducts?: Orderproduct[];
  Customer?: Customer;
  Company?: Company;
  GoBackToCreateOrder?: boolean;
  FulfillmentStatus?: string
  DriverId?: string
  DriverName?: string
  DriverStatus?: string
  DriverRequestId?: string
  DriverCount?: number
  DriverRequestLastModified?: string
  DriverQeu?: string
  DeliveryMins?: number;
  Delivery?: Delivery;
  Discount?: Promotion;
  FreeShipping?: boolean;
  PromoCode?: string;
  DriverTip?: number;
  DriverPercentage?: string;
  DriverRating?: string;
  DriverRatingNotes?: string;
  ProductRating?: string;
  ProductRatingNotes?: string;
  LocationNotes?: string;
  Driver?: User;
  Drivers?: User[];
  PaymentMethod?: string;
  Items?: Item[];

  AccetpTime?: string;
  CompanyName?: string;
  FinishTime?: string;
  PickUpTime?: string;
  DropOffTime?: string;
  DriverPayoutStatus?: string;
  DriverPayoutDate?: string;
  ShoprPayoutStatus?: string;
  ShopPayoutDates?: string;
  Metadata?: string;
  CashCollected?: number;
  DriverShippingFee?: number;
  RestaurantFee?: number;
  ShippingCommissionFee?: number;
  OrderCommissionFee?: number;
  UpdateProducts?: boolean; 
}