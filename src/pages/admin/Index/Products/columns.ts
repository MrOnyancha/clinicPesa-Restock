import { Product } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'fullName',
    id: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'salesDesc',
    id: 'salesDesc',
    header: 'Description',
  },
  {
    accessorKey: 'assetAccountRef.fullName',
    id: 'assetAccountRef',
    header: 'Type',
  },
  {
    accessorKey: 'incomeAccountRef.fullName',
    id: 'incomeAccountRef',
    header: 'Account',
  },
  {
    accessorKey: 'quantityOnHand',
    id: 'quantityOnHand',
    header: 'Total QTY On Hand',
  },
  {
    accessorKey: 'QuantityOnSalesOrder',
    id: 'QuantityOnSalesOrder',
    header: 'On Sale Order',
  },
  {
    accessorKey: 'unitOfMeasureSetRef.fullName',
    id: 'unitOfMeasureSetRef',
    header: 'U/M',
  },
  {
    accessorKey: 'salesPrice',
    id: 'salesPrice',
    header: 'Price',
  },
];
