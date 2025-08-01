import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import Pagination from '@/components/pagination/Pagination';
import { bulkSelectColumns } from './BultSelectColumns';
import { Product } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { useProductsWithInventory } from '@/utils/useProductsWithInventory';
import { useSearchItemsQuery } from '@/utils/useSearchItemsQuery';

interface BulkSelectProps {
  onItemsSelected?: (items: Product[]) => void;
}

const BulkSelect: React.FC<BulkSelectProps> = ({ onItemsSelected }) => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedMap, setSelectedMap] = useState<Map<string, Product>>(new Map());
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const isSearchActive = !!searchInput.trim();

  const sites = useMemo(() => {
    const siteName = localStorage.getItem('siteName') || 'clinicPesa HQ';
    const siteId = localStorage.getItem('siteId') || '100005';
    return [{ siteName, siteId }];
  }, []);

  const {
    data: defaultData = [],
    isLoading: loadingAll,
  } = useProductsWithInventory(pageIndex, pageSize, []);

  const {
    mutate: searchItems,
    data: searchResults,
    isPending: isSearching,
  } = useSearchItemsQuery();

  useEffect(() => {
    if (isSearchActive) {
      searchItems(searchInput.trim());
      setPageIndex(0);
    }
  }, [searchInput, searchItems]);

  const dataToShow = useMemo(() => {
    if (isSearchActive) {
      return searchResults?.items?.length ? searchResults.items : [];
    }
    return defaultData;
  }, [isSearchActive, searchResults, defaultData]);

  const isLoading = isSearchActive ? isSearching : loadingAll;

  const columns = useMemo(() => bulkSelectColumns, []);

  const table = useReactTable({
    data: dataToShow,
    columns,
    getRowId: (row) => row.listID,
    enableRowSelection: true,
    manualPagination: !isSearchActive,
    pageCount: isSearchActive ? undefined : 100, // Replace 100 with totalPages from backend if available
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const selectedRows = table.getSelectedRowModel().rows;

  useEffect(() => {
    const updatedMap = new Map(selectedMap);

    // Add selected
    selectedRows.forEach((row) => {
      updatedMap.set(row.id, row.original);
    });

    // Remove unselected
    dataToShow.forEach((item) => {
      const isStillSelected = selectedRows.find((row) => row.id === item.listID);
      if (!isStillSelected) {
        updatedMap.delete(item.listID);
      }
    });

    setSelectedMap(updatedMap);
  }, [selectedRows, dataToShow]);

  const handleAddSelectedItems = useCallback(() => {
    if (onItemsSelected) {
      onItemsSelected(Array.from(selectedMap.values()));
    }
  }, [selectedMap, onItemsSelected]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-64 p-2 border rounded-md mb-4 md:mb-0"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPageIndex(0);
          }}
        />

        <Button
          onClick={handleAddSelectedItems}
          disabled={selectedMap.size === 0}
          className="w-full md:w-auto mt-4 md:mt-0"
        >
          Add Selected Items
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Product List</h2>
      <div className="mb-2 text-sm text-gray-600">Selected items: {selectedMap.size}</div>

      {/* {isSearchActive && (
        <div className="mb-2 text-sm text-gray-600">
          Showing {dataToShow.length} result{dataToShow.length !== 1 ? 's' : ''} for "
          <span className="font-semibold">{searchInput}</span>"
        </div>
      )} */}

      <div className="border rounded-md">
        <table className="w-full table-auto">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 border-b text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-2" colSpan={table.getAllColumns().length}>
                  Loading...
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border-b">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="p-2 text-center text-gray-500">
                  {isSearchActive
                    ? 'No matching results found for your search.'
                    : 'No data available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Only show pagination when not searching */}
      {!isSearchActive && <Pagination table={table} />}
    </div>
  );
};

export default BulkSelect;
