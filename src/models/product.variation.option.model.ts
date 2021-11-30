import { Images } from "./images.model";

export interface ProductVariationOption {
  Id?: any;
  ProductVariationId: number;
  ProductId: string;
  VariationId: any;
  VariationOptionId: string;
  VariationName: string;
  ImageUrl: string;
  ShowOnline: string;
  Description: string;
  OptionName: string;
  Price: number;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  IsSelected?: boolean;
  Class?: string[];
  Images?: Images[];

}
