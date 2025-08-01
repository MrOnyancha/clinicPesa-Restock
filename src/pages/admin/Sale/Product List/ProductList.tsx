import React, { useEffect, useMemo, useState } from 'react';
import { WebService } from '@/web-services/WebService';
import UpdatePriceModal from './updatePrice';
import { toast } from 'sonner';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import Pagination from '@/components/pagination/Pagination';

const ProductList = () => {
  const [rawData, setRawData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [modalItem, setModalItem] = useState<{ itemName: string; salePrice: number } | null>(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const userRole = localStorage.getItem('adsRole') || 'DISPENSER';
  const siteName = localStorage.getItem('siteName') || 'clinicPesa HQ';
  const adsStation = localStorage.getItem('faciltyName') || '100005';

  const fetchInventory = async () => {
    setLoading(true);
    setError(false);
    try {
      const payload = {
        request: 'I_QUERY',
        sites: 'ALL',
        page: {
          page: 0,
          max: 1000,
        },
      };
      const response = await WebService.postPharma('inventory', payload);
      setRawData(response?.message ?? []);
    } catch (err) {
      console.error('❌ Failed to fetch inventory:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(false);
    try {
      const payload = {
        request: 'I_SEARCH',
        sites: 'ALL',
        search: [query.trim()],
      };
      const response = await WebService.postPharma('inventory', payload);
      setSearchResults(response?.message ?? []);
    } catch (err) {
      console.error('❌ Search failed:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchResults) {
      fetchInventory();
    }
  }, [searchResults]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Group inventory rows by itemName to show multiple batches per item
  const groupByItemName = (data: any[]) => {
    const grouped: Record<string, any> = {};
    data.forEach((item) => {
      const key = item.itemName;
      if (!grouped[key]) {
        grouped[key] = {
          ...item,
          batches: [item],
        };
      } else {
        grouped[key].batches.push(item);
      }
    });
    return Object.values(grouped);
  };

  const fullRows = useMemo(() => {
    const dataToUse = searchResults ?? rawData;
    return groupByItemName(dataToUse);
  }, [searchResults, rawData]);

  const paginatedRows = useMemo(() => {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return fullRows.slice(start, end);
  }, [fullRows, pageIndex, pageSize]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      header: 'Item Name',
      accessorKey: 'itemName',
      cell: ({ row }) => (
        <div title={row.original.itemName} className="max-w-xs whitespace-normal break-words text-sm">
          {row.original.itemName}
        </div>
      ),
    },
    {
      header: 'Batch Details',
      accessorKey: 'batches',
      cell: ({ row }) => (
        <table className="w-full text-xs border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-1 text-left">Batch No</th>
              {/* <th className="border p-1 text-center">Expiry</th> */}
              <th className="border p-1 text-center">Qty</th>
            </tr>
          </thead>
          <tbody>
            {row.original.batches.map((batch: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-1">{batch.batchNo}</td>
                {/* <td className="border p-1 text-center">
                  {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }) : '-'}
                </td> */}
                <td className="border p-1 text-center">{batch.overallQuantity ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      header: 'Qty On Site',
      accessorKey: 'sites',
      cell: ({ row }) => (
        <table className="w-full text-xs border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-1 text-left">Site Name</th>
              <th className="border p-1 text-center">Qty</th>
            </tr>
          </thead>
          <tbody>
            {(row.original.sites || []).map((site: any, i: number) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-1">{site.siteName}</td>
                <td className="border p-1 text-center">{site.quantityOnsite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      header: 'Overall Qty',
      accessorKey: 'overallQuantity',
      cell: info => <div className="text-center">{String(info.getValue() ?? '')}</div>,
    },
    {
      header: 'Sales Price',
      accessorKey: 'salesPrice',
      cell: info => <div className="text-right">{Number(info.getValue()).toLocaleString()}</div>,
    },
    {
      header: 'Units of Measure',
      accessorKey: 'unisOfMeasure',
      cell: ({ row }) => (
        <table className="w-full text-xs border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-1 text-left">Name</th>
              <th className="border p-1 text-center">Qty</th>
            </tr>
          </thead>
          <tbody>
            {(row.original.unisOfMeasure || []).map((uom: any, i: number) => (
              <tr key={i}>
                <td className="border p-1">{uom.fullName}</td>
                <td className="border p-1 text-center">{uom.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    ...(userRole !== 'DISPENSER'
      ? [
        {
          header: 'Actions',
          cell: ({ row }) => (
            <button
              onClick={() =>
                setModalItem({
                  itemName: row.original.itemName,
                  salePrice: row.original.salesPrice,
                })
              }
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded shadow text-xs"
            >
              Update Price
            </button>
          ),
        },
      ]
      : []),
  ], [userRole]);

  const table = useReactTable({
    data: paginatedRows,
    columns,
    pageCount: Math.ceil(fullRows.length / pageSize),
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
  });

  const handleUpdateSubmit = async (payload: {
    request: string;
    itemName: string;
    salePrice: number;
  }) => {
    try {
      const updatePayload = {
        request: 'UPDATE_PRICE',
        itemName: payload.itemName,
        salesPrice: payload.salePrice,
      };

      const response = await WebService.postPharma('inventory', updatePayload);

      if (response?.status === true) {
        toast.success('✅ Price updated!');
        setModalItem(null);

        const updatedRawData = rawData.map((item) =>
          item.itemName === payload.itemName ? { ...item, salesPrice: payload.salePrice } : item
        );
        setRawData(updatedRawData);

        if (searchResults) {
          const updatedSearchResults = searchResults.map((item) =>
            item.itemName === payload.itemName ? { ...item, salesPrice: payload.salePrice } : item
          );
          setSearchResults(updatedSearchResults);
        }
      } else {
        toast.error(`❌ Error: ${response?.status || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('API Error:', error);
      toast.error('❌ Something went wrong. Try again.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Pharmacy Inventory</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search item name..."
          className="border border-gray-300 p-2 rounded w-full max-w-md"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSearchResults(null);
            }}
            className="text-sm underline text-blue-500"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">Error loading data</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border p-2 text-left">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="align-top">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border p-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination table={table} />
        </>
      )}

      {modalItem && (
        <UpdatePriceModal
          itemName={modalItem.itemName}
          currentPrice={modalItem.salePrice}
          onClose={() => setModalItem(null)}
          onSubmit={handleUpdateSubmit}
        />
      )}
    </div>
  );
};

export default ProductList;
