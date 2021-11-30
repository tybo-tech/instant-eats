import { VariationOption } from './variation.option.model';

export interface Variation {
  CompanyVariationId: string;
  CompanyId: string;
  VariationId: string;
  Name: string;
  CompanyType: string;
  Description: string;
  IsDeleted: boolean;
  SelectionType?: string;
  PriceMode?: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  IsSelected?: boolean;
  Class?: string[];
  VariationsOptions?: VariationOption[];
}


