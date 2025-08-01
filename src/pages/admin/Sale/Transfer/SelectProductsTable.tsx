import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Button, Input, Pagination } from '@/components';
import { TransferProduct } from './columns';
import { Batch } from '../SalesReceipt/SRComboBox';

interface TransferTableProps {
  columns: ColumnDef<TransferProduct, any>[];
  data: TransferProduct[];
  onAddItems: (items: TransferProduct[]) => void;
  isEditMode?: boolean;
  onCancel?: () => void;
  isSingleItemEdit?: boolean;
}

type TableMeta = {
  updateData: (rowIndex: number, value: string) => void;
  getTransferQty: (rowId: string) => string;
  setError: (rowId: string, hasError: boolean) => void;
  resetInputs: boolean;
  updateSelectedBatch: (rowIndex: number, batch: Batch) => void;
  getSelectedBatch: (itemId: string) => Batch | undefined;
};

const searchRows = [{ label: 'Name', id: 'itemName' }];

export default function SelectProductsTable({
  columns,
  data: initialData,
  onAddItems,
  isEditMode = false,
  onCancel,
  isSingleItemEdit = false,
}: TransferTableProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedColumn, setSelectedColumn] = React.useState<string>(searchRows[0].id);
  const [rowSelection, setRowSelection] = React.useState(() => {
    // Only pre-select rows in edit mode
    if (isEditMode) {
      return initialData.reduce(
        (acc, _, index) => {
          acc[index] = true;
          return acc;
        },
        {} as Record<number, boolean>,
      );
    }
    return {};
  });
  const [quantityErrors, setQuantityErrors] = React.useState<Record<string, boolean>>({});
  const [resetTrigger, setResetTrigger] = React.useState(false);
  const [transferQuantities, setTransferQuantities] = React.useState(() => {
    // Only initialize quantities in edit mode
    if (isEditMode) {
      return initialData.reduce(
        (acc, item) => {
          acc[item.itemId] = item.TransferQty || '';
          return acc;
        },
        {} as Record<string, string>,
      );
    }
    return {};
  });
  const [selectedBatches, setSelectedBatches] = React.useState<Record<string, Batch>>(() => {
    // Initialize with any existing selected batches in edit mode
    if (isEditMode) {
      return initialData.reduce(
        (acc, item) => {
          if (item.selectedBatch) {
            acc[item.itemId] = item.selectedBatch;
          }
          return acc;
        },
        {} as Record<string, Batch>,
      );
    }
    return {};
  });
  const [selectedItemsBucket, setSelectedItemsBucket] = React.useState(() => {
    // Only initialize bucket in edit mode
    if (isEditMode) {
      return initialData.reduce(
        (acc, item) => {
          acc[item.itemId] = item;
          return acc;
        },
        {} as Record<string, TransferProduct>,
      );
    }
    return {};
  });
  const [allSelectedItems, setAllSelectedItems] = React.useState<Record<string, TransferProduct>>(() => {
    if (isEditMode) {
      return initialData.reduce(
        (acc, item) => {
          acc[item.itemId] = item;
          return acc;
        },
        {} as Record<string, TransferProduct>,
      );
    }
    return {};
  });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  const [data] = React.useState<TransferProduct[]>(initialData);

  // Store original state for edit mode
  const [originalBucket] = React.useState(() => {
    if (isEditMode) {
      return initialData.reduce(
        (acc, item) => {
          acc[item.itemId] = item;
          return acc;
        },
        {} as Record<string, TransferProduct>,
      );
    }
    return {};
  });

  // Update bucket when row selection changes
  React.useEffect(() => {
    if (!isEditMode) {
      // Original behavior for non-edit mode
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        const item = row.original;
        const qty = transferQuantities[item.itemId];
        if (qty) {
          setSelectedItemsBucket((prev) => ({ ...prev, [item.itemId]: { ...item, TransferQty: qty } }));
        }
      });
    } else {
      // In edit mode, update allSelectedItems based on visible selection changes
      table.getFilteredRowModel().rows.forEach((row, index) => {
        const item = row.original;
        if (rowSelection[index]) {
          // Add or update item in allSelectedItems
          setAllSelectedItems((prev) => ({
            ...prev,
            [item.itemId]: {
              ...item,
              TransferQty: transferQuantities[item.itemId] || item.TransferQty || '',
            },
          }));
        } else {
          // Remove item from allSelectedItems
          setAllSelectedItems((prev) => {
            const newItems = { ...prev };
            delete newItems[item.itemId];
            return newItems;
          });
        }
      });
    }
  }, [rowSelection, transferQuantities, isEditMode]);

  // Update quantities in allSelectedItems when they change
  React.useEffect(() => {
    if (isEditMode) {
      Object.entries(transferQuantities).forEach(([id, qty]) => {
        setAllSelectedItems((prev) => ({
          ...prev,
          [id]: prev[id] ? { ...prev[id], TransferQty: qty } : prev[id],
        }));
      });
    }
  }, [transferQuantities, isEditMode]);

  // Pre-select rows that are in the bucket
  React.useEffect(() => {
    const newSelection: Record<string, boolean> = {};
    data.forEach((item, index) => {
      if (selectedItemsBucket[item.itemId]) {
        newSelection[index] = true;
        // Restore quantity if it exists
        const bucketItem = selectedItemsBucket[item.itemId];
        setTransferQuantities((prev) => ({ ...prev, [item.itemId]: bucketItem.TransferQty }));
      }
    });
    setRowSelection(newSelection);
  }, [data]);

  // Pre-select the single item in edit mode
  React.useEffect(() => {
    if (isEditMode && isSingleItemEdit) {
      setRowSelection({ 0: true });
      if (initialData[0]) {
        setTransferQuantities({
          [initialData[0].itemId]: initialData[0].TransferQty || '',
        });
      }
    }
  }, [isEditMode, isSingleItemEdit, initialData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      rowSelection,
      pagination,
    },
    meta: {
      updateData: (rowIndex: number, value: string) => {
        const rowId = data[rowIndex].itemId;
        setTransferQuantities((prev) => ({ ...prev, [rowId]: value }));
      },
      getTransferQty: (rowId: string) => transferQuantities[rowId] || '',
      setError: (rowId: string, hasError: boolean) => {
        setQuantityErrors((prev) => ({ ...prev, [rowId]: hasError }));
      },
      resetInputs: resetTrigger,
      updateSelectedBatch: (rowIndex: number, batch: Batch) => {
        const item = data[rowIndex];
        if (item) {
          setSelectedBatches((prev) => ({ ...prev, [item.itemId]: batch }));

          // Update the maximum transferable quantity based on the selected batch
          const maxQuantity = batch.quantity.toString();
          // Only set the transfer quantity if it's not already set or exceeds the new maximum
          setTransferQuantities((prev) => {
            const currentQty = prev[item.itemId] || '';
            if (!currentQty || Number(currentQty) > Number(maxQuantity)) {
              return { ...prev, [item.itemId]: maxQuantity };
            }
            return prev;
          });
        }
      },
      getSelectedBatch: (itemId: string) => selectedBatches[itemId],
    } as TableMeta,
  });

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setColumnFilters([
      {
        id: selectedColumn,
        value: value,
      },
    ]);
  };

  const handleCancel = () => {
    if (isEditMode && onCancel) {
      onCancel();
    } else {
      setRowSelection({});
      setQuantityErrors({});
      setTransferQuantities({});
      setSelectedItemsBucket({});
      setAllSelectedItems({});
      setColumnFilters([]);
      setSelectedColumn(searchRows[0].id);
      setResetTrigger((prev) => !prev);
    }
  };

  const handleAddSelectedItems = () => {
    if (isEditMode) {
      if (isSingleItemEdit) {
        // In single item edit mode, return the edited item
        const item = table.getRowModel().rows[0]?.original;
        if (item) {
          onAddItems([
            {
              ...item,
              TransferQty: transferQuantities[item.itemId] || item.TransferQty || '',
              selectedBatch: selectedBatches[item.itemId],
            },
          ]);
        }
      } else {
        // Original edit mode behavior
        const items = Object.values(allSelectedItems).map((item) => ({
          ...item,
          TransferQty: transferQuantities[item.itemId] || item.TransferQty || '',
          selectedBatch: selectedBatches[item.itemId],
        }));
        if (items.length > 0) {
          onAddItems(items);
        }
      }
    } else {
      // Original non-edit mode behavior
      const items = Object.values(selectedItemsBucket).map((item) => ({
        ...item,
        selectedBatch: selectedBatches[item.itemId],
      }));
      if (items.length > 0) {
        onAddItems(items);
        handleCancel(); // Reset form after adding
      }
    }
  };

  const hasInvalidQuantities = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    return selectedRows.some((row) => {
      const item = row.original;
      const selectedBatch = selectedBatches[item.itemId];
      const availableQuantity = selectedBatch ? selectedBatch.quantity : 0;
      const transferQty = transferQuantities[item.itemId];

      // Check if transfer quantity is empty, 0, or exceeds available quantity
      return (
        !transferQty || Number(transferQty) === 0 || Number(transferQty) > availableQuantity || quantityErrors[row.id]
      );
    });
  };

  return (
    <div className="w-[1200px] px-4 py-2">
      {!isSingleItemEdit && (
        <div className="flex items-center gap-4 my-2">
          <div className="flex items-center gap-1">
            <span className="pl-4 pr-2 text-xs text-nowrap">Look for:</span>
            <Input
              type="text"
              placeholder="Search product..."
              className="w-[400px] bg-slate-100"
              value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ''}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      )}
      <div className="flex gap-3 items-center justify-end w-full p-3">
        <Button
          type="button"
          variant="default"
          onClick={handleAddSelectedItems}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0 || hasInvalidQuantities()}
        >
          {isEditMode ? 'Update' : 'Add'} Selected Items
          {table.getFilteredSelectedRowModel().rows.length != 0 || hasInvalidQuantities()
            ? `(${table.getFilteredSelectedRowModel().rows.length})`
            : ''}
        </Button>
        <Button
          type="button"
          variant="danger"
          className="bg-red-50 hover:bg-red-100 hover:text-red-600"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Pagination table={table} />
      <hr />
    </div>
  );
}
