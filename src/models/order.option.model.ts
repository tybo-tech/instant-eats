import { Images } from "./images.model";

export interface OrderOption {
  ProductVariationId: number;
  ProductId: string;
  VariationOptionId: string;
  VariationName: string;
  OptionName: string;
  Price: number;
}
