import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Input, Checkbox, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { InventoryProduct, Batch } from '../SalesReceipt/SRComboBox';
import { formatTimestamp } from '@/utils/formatter';

interface SelectionMeta {
  updateData: (rowIndex: number, value: string) => void;
  setError: (rowId: string, hasError: boolean) => void;
  getTransferQty: (listId: string) => string;
  resetInputs?: boolean;
  updateSelectedBatch: (rowIndex: number, batch: Batch) => void;
  getSelectedBatch: (itemId: string) => Batch | undefined;
}

export type TransferProduct = InventoryProduct & {
  TransferQty: string;
  selectedBatch?: Batch;
};

export const columns: ColumnDef<TransferProduct, any>[] = [
  {
    id: 'itemId',
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
    accessorKey: 'itemName',
    id: 'itemName',
    header: 'Name',
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      return rowValue.toString().toLowerCase().includes(value.toString().toLowerCase());
    },
  },
  {
    accessorKey: 'batchNo',
    id: 'batchNo',
    header: () => <span className="text-nowrap">Batch Number</span>,
    cell: ({ row, table }) => {
      const item = row.original;
      const meta = table.options.meta as SelectionMeta;
      const selectedBatch = meta.getSelectedBatch?.(item.itemId);

      if (!item.batches || item.batches.length === 0) {
        return <span>No batches available</span>;
      }

      const handleBatchChange = (value: string) => {
        const selected = item.batches.find((batch) => batch.batchNo === value);
        if (selected) {
          meta.updateSelectedBatch?.(row.index, selected);
        }
      };

      return (
        <Select value={selectedBatch?.batchNo || ''} onValueChange={handleBatchChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Batch" />
          </SelectTrigger>
          <SelectContent>
            {item.batches.map((batch) => (
              <SelectItem key={batch.batchNo} value={batch.batchNo}>
                {batch.batchNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'quantity',
    id: 'quantity',
    header: () => <span className="text-nowrap">QTY On Hand</span>,
    cell: ({ row, table }) => {
      const item = row.original;
      const meta = table.options.meta as SelectionMeta;
      const selectedBatch = meta.getSelectedBatch?.(item.itemId);

      return <div className="text-center">{selectedBatch ? selectedBatch.quantity : '-'}</div>;
    },
  },
  {
    accessorKey: 'TransferQty',
    id: 'transferQty',
    header: () => <span className="text-nowrap">QTY To Transfer</span>,
    cell: ({ row, table }) => {
      const meta = table.options.meta as SelectionMeta;
      const [qty, setQty] = React.useState(meta.getTransferQty(row.original.itemId));
      const [error, setError] = React.useState('');
      const selectedBatch = meta.getSelectedBatch?.(row.original.itemId);
      const quantityOnHand = selectedBatch ? selectedBatch.quantity : 0;

      React.useEffect(() => {
        if (meta.resetInputs) {
          setQty('');
          setError('');
        }
      }, [meta.resetInputs]);

      const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQty(value);

        const numValue = Number(value);
        const hasError = numValue > quantityOnHand || numValue <= 0 || isNaN(numValue);

        if (hasError) {
          if (numValue <= 0 || isNaN(numValue)) {
            setError('Quantity must be greater than 0');
          } else {
            setError(`Cannot transfer more than ${quantityOnHand} items`);
          }
        } else {
          setError('');
        }

        meta.updateData(row.index, value);
        meta.setError(row.id, hasError);
      };

      return (
        <div className="text-center">
          <Input
            type="number"
            value={qty}
            onChange={handleQtyChange}
            min="1"
            placeholder="Enter quantity"
            disabled={quantityOnHand === 0}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: 'expiryDate',
    id: 'expiryDate',
    header: 'Expiry Date',
    cell: ({ row, table }) => {
      const item = row.original;
      const meta = table.options.meta as SelectionMeta;
      const selectedBatch = meta.getSelectedBatch?.(item.itemId);

      return <div className="text-nowrap">{selectedBatch ? formatTimestamp(selectedBatch.expiryDate) : '-'}</div>;
    },
  },
];
