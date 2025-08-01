import { Product } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export const bulkSelectColumns: ColumnDef<Product, any>[] = [
  {
    id: 'listID',
    header: '-',
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'fullName',
    id: 'fullName',
    header: 'Name',
  },

  {
    accessorFn: (row) => row.itemsLeft,
    id: 'itemsLeft',
    header: 'Items Left',
    cell: ({ row }) => {
      const value = row.original.itemsLeft;
      return <span className="text-nowrap">{value ?? '—'}</span>;
    },
  },
  {
    accessorFn: (row) => row.unitOfMeasureSetRef?.fullName,
    id: 'unitOfMeasureSetRef',
    header: 'U/M',
    cell: ({ row }) => (
      <span className="text-nowrap">
        {row.original.unitOfMeasureSetRef?.fullName || '---'}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.salesDesc,
    id: 'salesDesc',
    header: 'Description',
  },
];
