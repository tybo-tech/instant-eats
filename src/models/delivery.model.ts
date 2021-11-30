import { Order } from ".";
import { DriverDelivery } from "./delivery-driver.model";

export interface Delivery {
  FromAddress: string;
  ToAddress: string;
  DeliveryId: string;
  CompanyId: string;
  CustomerId: string;
  OrderId: string;
  LatitudeFrom: number;
  LongitudeFrom: number;
  LatitudeTo: number;
  LongitudeTo: number;
  DirectionFrom: string;
  DirectionTo: string;
  FromName: string;
  ToName: string;
  Sammary: string;
  TotalTime: string;
  TotalCharge: string;
  TotalDistance: string;
  DriverId: string;
  DriverName: string;
  DriverDp: string;
  DriverReg: string;
  DriverGender: string;
  DriverFee: string;
  DeliverStatus: string;
  Notes: string;
  CreateUserId: string;
  ModifyUserId: string;
  StatusId: number
  Order?: Order
  DriverDeliveryList?: DriverDelivery[];
}
