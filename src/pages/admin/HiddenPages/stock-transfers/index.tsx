import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatDate";
import { Plus, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router";

interface Warehouse {
  id: number;
  name: string;
}

interface StockTransfer {
  id: number;
  transferNumber: string;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

const StockTransfersPage = () => {
  const navigate = useNavigate();

  const { data: stockTransfers, isLoading } = useQuery({
    queryKey: ['/api/stock-transfers'],
  });

  const { data: warehouses } = useQuery({
    queryKey: ['/api/warehouses'],
  });

  const getWarehouseName = (warehouseId: number) => {
    const warehouse = (warehouses as Warehouse[] | undefined)?.find((w) => w.id === warehouseId);
    return warehouse ? warehouse.name : '-';
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50 border-green-200">
            Completed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-200">
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-600 hover:bg-red-50 border-red-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-neutral-50 text-neutral-600 hover:bg-neutral-50 border-neutral-200">
            {status}
          </Badge>
        );
    }
  };

  return (
    <React.Fragment>
      <section className="p-2 m-2 border rounded shadow-md dark:border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-heading font-bold text-neutral-800">Stock Transfers</h2>
          <Button
            onClick={() => navigate('/admin/sale/transfer')}
            className="bg-[#00B5BD] hover:bg-[#00a5ac] text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> New Transfer
          </Button>
        </div>

        <Card className="border border-neutral-100">
          <CardHeader className="px-6 py-5 border-b border-neutral-100">
            <CardTitle className="font-heading font-semibold text-neutral-800">Stock Transfers List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-8 text-center text-neutral-500">
                Loading stock transfers...
              </div>
            ) : (stockTransfers as StockTransfer[] | undefined)?.length === 0 ? (
              <div className="py-8 text-center text-neutral-500">
                No stock transfers found. Create your first stock transfer.
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-neutral-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Transfer #</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Source</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Destination</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Status</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Created Date</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Completed Date</TableHead>
                    <TableHead className="text-xs font-medium text-neutral-500 uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(stockTransfers as StockTransfer[] | undefined)?.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-neutral-50">
                      <TableCell className="text-sm font-medium text-primary-700">
                        {transfer.transferNumber}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">
                        {getWarehouseName(transfer.sourceWarehouseId)}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">
                        {getWarehouseName(transfer.destinationWarehouseId)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transfer.status)}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">
                        {formatDate(transfer.createdAt)}
                      </TableCell>
                      <TableCell className="text-sm text-neutral-700">
                        {transfer.completedAt ? formatDate(transfer.completedAt) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/stock-transfers/${transfer.id}`)}>
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </React.Fragment>
  );
};

export default StockTransfersPage;
