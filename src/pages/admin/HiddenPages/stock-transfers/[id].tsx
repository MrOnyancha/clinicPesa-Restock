npmimport { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Truck, PackageCheck, ClipboardList } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { formatCurrency } from "@/utils/formatCurrency";

interface StockTransfer {
  id: number; // Assuming an id property
  transferNumber: string;
  status: string;
  createdAt: string; // Or Date, depending on the actual data type
  completedAt?: string; // Or Date, nullable
  notes?: string;
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  userId: number;
  items: any[]; // Assuming items is an array of any for now, will refine later if needed
}

interface Warehouse {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
}

const StockTransferDetailPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);

  // Load stock transfer details
  const { data: stockTransfer, isLoading } = useQuery<StockTransfer>({
    queryKey: [`/api/stock-transfers/${id}`],
  });

  // Load warehouse details
  const { data: warehouses } = useQuery<Warehouse[]>({
    queryKey: ['/api/warehouses'],
  });

  // Load product details
  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Find warehouse names
  const getWarehouseName = (warehouseId: number) => {
    const warehouse = warehouses?.find((w: Warehouse) => w.id === warehouseId);
    return warehouse ? warehouse.name : `Warehouse ${warehouseId}`;
  };

  // Find product details
  const getProductDetails = (productId: number) => {
    const product = products?.find((p) => p.id === productId);
    return product || { name: `Product ${productId}`, sku: "Unknown" };
  };

  // Format status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <MainLayout pageTitle="Stock Transfer Details" breadcrumb="Stock Transfers / Details">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!stockTransfer) {
    return (
      <MainLayout pageTitle="Stock Transfer Details" breadcrumb="Stock Transfers / Details">
        <div className="flex flex-col justify-center items-center h-64">
          <h2 className="text-xl font-bold">Stock Transfer Not Found</h2>
          <p className="text-gray-500 mb-4">The requested stock transfer could not be found.</p>
          <Button onClick={() => setLocation("/stock-transfers")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stock Transfers
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Stock Transfer Details" breadcrumb={`Stock Transfers / ${stockTransfer.transferNumber}`}>
      <div className="mb-4 flex justify-between items-center">
        <Button variant="outline" onClick={() => setLocation("/stock-transfers")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stock Transfers
        </Button>

        <div className="flex items-center gap-2">
          {stockTransfer.status === "pending" && (
            <>
              <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600">
                <Truck className="w-4 h-4 mr-2" /> Mark as In Transit
              </Button>
              <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600">
                Cancel
              </Button>
            </>
          )}
          {stockTransfer.status === "in_transit" && (
            <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
              <PackageCheck className="w-4 h-4 mr-2" /> Mark as Completed
            </Button>
          )}
          <Button variant="outline">
            <ClipboardList className="w-4 h-4 mr-2" /> Print Details
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Transfer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Transfer Number</dt>
                <dd className="mt-1 text-sm font-semibold">{stockTransfer.transferNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{getStatusBadge(stockTransfer.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created Date</dt>
                <dd className="mt-1 text-sm">{formatDate(stockTransfer.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Completed Date</dt>
                <dd className="mt-1 text-sm">
                  {stockTransfer.completedAt ? formatDate(stockTransfer.completedAt) : "Not completed"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm">{stockTransfer.notes || "No notes provided"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Source Warehouse</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {getWarehouseName(stockTransfer.sourceWarehouseId)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Destination Warehouse</dt>
                <dd className="mt-1 text-sm font-semibold">
                  {getWarehouseName(stockTransfer.destinationWarehouseId)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Processed By</dt>
                <dd className="mt-1 text-sm">
                  User ID: {stockTransfer.userId}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Transfer Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockTransfer.items && stockTransfer.items.length > 0 ? (
                stockTransfer.items.map((item: any) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                    No items found for this stock transfer
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {stockTransfer.status === "completed" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Completion Details</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Completed Date</dt>
                <dd className="mt-1 text-sm">
                  {stockTransfer.completedAt ? formatDate(stockTransfer.completedAt) : "Not completed"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Received By</dt>
                <dd className="mt-1 text-sm">
                  User ID: {stockTransfer.userId}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
};

export default StockTransferDetailPage;
