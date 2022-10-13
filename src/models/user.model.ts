import { Company } from "./company.model";
import { Item } from "./item.model";
import { Order } from "./order.model";

export interface User {
  Selected?: boolean;
  Id?: number;
  UserStatus?: any;
  UserId?: string;
  Email: string;
  Name: string;
  UserType?: string;
  Surname: string;
  Address?: string;
  Password: string;
  CompanyId?: string;
  CompanyName?: string;
  CompanyDp?: string;
  Slug?: string;
  RoleId?: number;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  NewPassword?: string;
  ConfirmPassword?: string;
  StatusId: any;
  UserToken?: any;
  Dp?: any;
  AddressLineHome: string;
  AddressUrlHome: string;
  AddressLineWork: string;
  AddressUrlWork: string;
  SystemRole?: string;
  SecurityToken?: string;
  Roles?: UserRole[];
  Viewing?: boolean;
  PhoneNumber: any;
  Company?: Company;
  ReferralCode?: string;
  ParentReferralCode?: string;
  Latitude?: number;
  Longitude?: number;
  CarReg?: string;
  CarType?: string;
  QueNumber?: number;
  DailyOrders?: number;
  TotalOrders?: number;
  LastDeliveryTime?: string;
  LastDeliveryCount?: number;
  DriverStatus?: string;
  Gender?: string;
  Items?: Item[];
  RelatedItems?: Item[];
  AcceptedOrders?: Order[];
  Requests?: Order[];
  Timeouts?: Item[];
  Declines?: Item[];
}


export interface UserModel {
  ParentReferralCode?: string;
  Dp?: any;
  AddressUrlHome?: any;
  AddressLineWork?: any;
  AddressUrlWork?: any;
  Name: string;
  Surname?: string;
  Email: string;
  PhoneNumber: string;
  Password?: any;
  UserType?: any;
  ImageUrl: string;
  AccessType: string;
  AccessStatus: string;
  AccessStartDate: string;
  AccessEndDate: string;
  CreateUserId: string;
  ModifyUserId: string;
  AddressLineHome?: string;
  UserStatus?: string;
  CarReg?: string;
  StatusId: number;
  UserToken?: any;
  Roles: Role[];

}
export interface Role {
  Name: string;
}
export interface UserRole {
  RoleId: string;
  UserId: string;
  RoleName: string;
}
