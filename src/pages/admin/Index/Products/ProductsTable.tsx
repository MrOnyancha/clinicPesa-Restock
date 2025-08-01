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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Pagination from '@/components/pagination/Pagination';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MdOutlineResetTv } from 'react-icons/md';
import { useTSelector } from '@/store/hooks';
// import Loader from '@/components/Loader/Loader';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const searchRows = [
  { label: 'Name', id: 'fullName' },
  { label: 'Description', id: 'salesDesc' },
];

export function ProductsTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedColumn, setSelectedColumn] = React.useState<string>(searchRows[0].id);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const isLoading = useTSelector((state) => state.products.isLoading);

  return (
    <div>
      <div className="flex items-center gap-4 my-2">
        <div className="flex items-center gap-1">
          <span className="pl-4 pr-2 text-xs text-nowrap">Look for:</span>
          <Input
            type="text"
            placeholder="Search product..."
            className="w-[400px] bg-slate-100"
            value={(table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(selectedColumn)?.setFilterValue(event.target.value)}
          />
        </div>
        in
        <Select onValueChange={setSelectedColumn} value={selectedColumn}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="select row...">
              {searchRows.find((row) => row.id === selectedColumn)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {searchRows.map((row) => (
              <SelectItem key={row.id} value={row.id}>
                {row.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => {
            setColumnFilters([]);
            setSelectedColumn(searchRows[0].id);
          }}
          variant="outline"
          className="flex items-center "
        >
          <span>
            <MdOutlineResetTv size={18} />
          </span>
          Reset
        </Button>
      </div>
      <div className="rounded-md border mx-2">
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
            {isLoading ? (
              <div className="w-full flex-center">
                {/* <div className='flex items-center gap-2 bg-primary p-2 rounded-md'>
                  <Loader />
                  <span>loading...</span>
                </div> */}
              </div>
            ) : (
              <>
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
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination table={table} />
    </div>
  );
}
