
export interface Item {
  Id?: string;
  IdUi?: string;
  Selected?: boolean;
  ItemId: string;
  RelatedId: string;
  RelatedParentId: string;
  Name: string;
  CompanyId?: string;
  ParentId?: string;
  ItemType?: string;
  Description?: string;
  IsFeatured?: string;
  ItemDetails?: string;
  DescriptionJson?: OperatingHoursModel[];
  OrderingNo?: number;
  Price?: number;
  LimitValue: number;
  OffLimitPrice: number;
  ItemStatus?: string;
  ItemCode?: string;
  ImageUrl?: string;
  ImageUrl2?: string;
  ImageUrl3?: string;
  ImageUrl4?: string;
  ImageUrl5?: string;
  FooterImage?: string;
  ItemPin?: string;
  ItemCategory: string;
  ItemSubCategory?: string;
  Latitude?: number;
  Longitude?: number;
  AddressLine?: string;
  LocationType?: string;
  LocationNumber?: string;
  ItemStyle?: string;
  CardType?: string;
  ImageStyles?: string;
  HeadingStyle?: string;
  ActionName?: string;
  ActionUrl?: string;
  SecondaryActionName?: string;
  SecondaryActionUrl?: string;
  ShowMoreName?: string;
  ShowMoreUrl?: string;
  CreateDate?: string;
  CreateUserId?: string;
  ModifyDate?: string;
  ModifyUserId?: string;
  StatusId?: number;
  Children?: Item[];
  SelectedItemId?: string;
  ShowMore?: boolean;
  Style?: any;
  Goto?: string

}

export interface OperatingHoursModel {
  Day: string;
  Open: string
  OpenTime: string
  CloseTime: string
}

export const OPARATING_HOURS: OperatingHoursModel[] = [
  { Day: 'Monday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Tuesday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Wednesday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Thursday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Friday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Saturday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Sunday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
  { Day: 'Public holiday', Open: 'open', OpenTime: '08:00', CloseTime: '17:00' },
]