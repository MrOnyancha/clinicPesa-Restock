// BulkSelectTable.tsx

import React, { useEffect, useRef } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  // Removed PaginationState import as it's not strictly necessary if useState manages it
} from '@tanstack/react-table';
import { Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Input, Pagination } from '@/components';
import { useAppSelector } from '@/store/hooks';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSelectionChange?: (selectedItems: TData[]) => void;
  selectedItems?: TData[];
  // Reverted onPaginationChange to its original, optional prop type
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
}

export function BulkSelectTable<TData, TValue>({
  columns,
  data,
  searchValue,
  // onSearchChange, // Still not used, consider removing from props if truly unused
  onSelectionChange,
  selectedItems = [],
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  // Keep internal pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [rowSelection, setRowSelection] = React.useState({});
  const previousSelectionRef = React.useRef({});
  const initializedRef = React.useRef(false);

  const isLoading = useAppSelector((state) => state.products.isLoading);

  const handleRowSelectionChange = React.useCallback((newSelection: {}) => {
    setRowSelection(newSelection);
    previousSelectionRef.current = newSelection;
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination, // React Table's internal pagination state
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      pagination,
      rowSelection,
    },
  });

  // Effect to notify parent about internal table pagination changes (optional, for logging/debugging)
  useEffect(() => {
    onPaginationChange?.(table.getState().pagination);
  }, [table.getState().pagination, onPaginationChange]);

  // --- NEW OR MODIFIED EFFECT FOR DATA CHANGES ---
  const initialDataLengthRef = useRef(data.length); // Keep track of initial data length
  useEffect(() => {
    // This effect runs when the 'data' prop changes (e.g., when more items are loaded).
    // We want to advance the table's internal page if new data has been added.

    if (data.length > initialDataLengthRef.current) {
        // Data has grown, meaning new items were fetched.
        // Calculate the page index that would show the newly added items.
        const newTotalPages = Math.ceil(data.length / pagination.pageSize);
        const newPageIndex = Math.max(0, newTotalPages - 1); // Go to the last page of the expanded data

        // Update the internal pagination state to show the new page
        setPagination(prev => ({
            ...prev,
            pageIndex: newPageIndex,
        }));

        // Update the ref to the current data length
        initialDataLengthRef.current = data.length;
    } else if (data.length < initialDataLengthRef.current) {
        // Data has shrunk (e.g., due to search filter, or some items removed).
        // It's often good to reset to the first page in such cases.
        setPagination(prev => ({
            ...prev,
            pageIndex: 0,
        }));
        initialDataLengthRef.current = data.length;
    }
    // If data.length is the same, no action needed for pagination adjustment.
  }, [data.length, pagination.pageSize]); // Depend on data.length and pageSize


  const previousDataRef = React.useRef<any[]>([]);

  useEffect(() => {
    if (
      previousDataRef.current.length === (data as any[]).length &&
      JSON.stringify(previousDataRef.current.map((d) => d.fullName || d.id)) ===
      JSON.stringify((data as any[]).map((d) => d.fullName || d.id))
    ) {
      return;
    }

    previousDataRef.current = [...(data as any[])];

    if (selectedItems && selectedItems.length > 0) {
      const newSelectionState: Record<string, boolean> = {};

      const dataMap = new Map();
      (data as any[]).forEach((item: any, index) => {
        const key = item.fullName || item.id || item.name;
        if (key) dataMap.set(key, index);
      });

      (selectedItems as any[]).forEach((selectedItem: any) => {
        const itemKey = selectedItem.fullName || selectedItem.id || selectedItem.name;
        if (itemKey && dataMap.has(itemKey)) {
          newSelectionState[dataMap.get(itemKey)] = true;
        }
      });

      handleRowSelectionChange(newSelectionState);
    } else {
      handleRowSelectionChange({});
    }

    initializedRef.current = true;
  }, [data, selectedItems, handleRowSelectionChange]);

  const prevSearchValueRef = useRef(searchValue);

  useEffect(() => {
    if (prevSearchValueRef.current !== searchValue) {
      prevSearchValueRef.current = searchValue;
      initializedRef.current = false;
    }
  }, [searchValue]);

  const notifiedSelectionRef = useRef<Record<string, boolean>>({});
  useEffect(() => {
    const selectionChanged = JSON.stringify(rowSelection) !== JSON.stringify(notifiedSelectionRef.current);

    if (onSelectionChange && selectionChanged) {
      notifiedSelectionRef.current = { ...rowSelection };
      const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);
      onSelectionChange(selectedRows as TData[]);
    }
  }, [rowSelection, onSelectionChange, table]);

  useEffect(() => {
    if (selectedItems && data.length > 0) {
      const dataMap = new Map(
        (data as any[]).map((item: any, index) => [item.fullName || item.id || item.name || `item-${index}`, index]),
      );

      const visibleSelectedItems = (selectedItems as any[]).filter((item: any) => {
        const key = item.fullName || item.id || item.name;
        return key && dataMap.has(key);
      });

      if (visibleSelectedItems.length > 0) {
        initializedRef.current = true;
      }
    }
  }, [selectedItems, data]);

  return (
    <div className="rounded-md border mt-1 w-full max-w-full px-4">
      <div className="overflow-x-auto sm:overflow-x-hidden">

        <Table>
          <TableHeader>
            <h1>Hello</h1>
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
                  No Products Found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <hr />
      <div className="flex-1 text-sm text-muted-foreground ml-2 mt-2">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <Pagination table={table} />
    </div>
  );
}

export default BulkSelectTable;