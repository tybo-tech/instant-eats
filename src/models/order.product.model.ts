import { OrderOption } from "./order.option.model";

export interface Orderproduct {
  Id: string;
  OrderId: string;
  ProductId: string;
  CompanyId: string;
  ProductName: string;
  ProductType: string;
  Size: string;
  Colour: string;
  FeaturedImageUrl: string;
  UnitPrice: number;
  Quantity: number;
  SubTotal: number;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  DiscountPrice?: number

  OrderOptions?: OrderOption[];
  OrderOptionsString?: string;
};


