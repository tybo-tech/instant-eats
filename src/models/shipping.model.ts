export interface Shipping {
  ShippingId: string;
  CompanyId: string;
  Name: string;
  Description: string;
  Price: number;
  ImageUrl: string;
  CreateDate?: string;
  CreateUserId: string;
  ModifyDate?: string;
  ModifyUserId: string;
  StatusId: number;
  Selected?: boolean;
}


export const SHIPPING_OPTIONS: Shipping[] = [
  {
    ShippingId: 'collect',
    CompanyId: '',
    Name: 'Collect',
    Description: '',
    Price: 0,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1

  },
  {
    ShippingId: 'delivery',
    CompanyId: '',
    Name: 'Delivery',
    Description: '',
    Price: 25,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1
  },
  {
    ShippingId: 'free',
    CompanyId: '',
    Name: 'Free Shipping',
    Description: '',
    Price: 0,
    ImageUrl: '',
    CreateUserId: undefined,
    ModifyUserId: undefined,
    StatusId: 1
  },


]