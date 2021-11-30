import { ProductVariationOption } from './product.variation.option.model';

export interface ProductVariation {
  Id?: number;
  ProductId: string;
  CompanyVariationId: string;
  VariationName: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  PriceMode?: string;
  IsRequired?: string;
  NumberOfSelection?: string;
  ProductVariationOptions?: ProductVariationOption[];
}
