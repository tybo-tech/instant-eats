import { Interaction } from "./interaction.model";
import { OperatingHours } from "./operatinghours.model";
import { Product } from "./product.model";
import { Promotion } from "./promotion.model";

export interface Company {
  CompanyId: string;
  Name: string;
  Slug: string;
  Description?: any;
  CompanyType: string;
  Dp?: any;
  IsDeleted: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: string;
  Products?: Product[];
  CategoryIds?: Product[];
  Promotions?: Promotion[];
  GeCategoryNames?: any[];
  Latitude?: number;
  Longitude?: number;
  Radius?: number;
  DeliveryMode?: string;
  DeliveryTime?: string;
  MinimumOrder?: string;
  
  BaseDeliveryCharge?: number;
  DeliveryChargePerKM?: number;
  CommissionMode?: string;
  CommissionAmount?: number;
  DeliveryCommissionAmount?: number;

  Background: string;
  Color: string;
  Phone: string;
  Email: string;
  AddressLine: string;
  Location: string;
  BankName: string;
  BankAccNo: string;
  BankAccHolder: string;
  BankBranch: string;
  ProductsCount?: any;
  Liked?: boolean;
  Interaction?: Interaction;
  Followers?: any[];
  OperatingHours?: OperatingHours[];

}