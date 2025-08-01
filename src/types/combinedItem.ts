export interface CombinedItem {
  itemName: string;
  unitOfMeasure: string;
  totalQuantity: number;
  siteQuantities: { [site: string]: number };
}
