import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateFormat";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export interface Sale {
  cashier: any;
  siteId: string;
  saleId: string;
  customerId: null | string;
  customerName: string;
  totalAmount: number;
  status: string;
  saleDate: number;
}

interface RecentSalesTableProps {
  sales: Sale[];
  isLoading: boolean;
}

const RecentSalesTable: React.FC<RecentSalesTableProps> = ({ sales, isLoading }) => {
  console.log("Recent Sales:", sales);
  return (
    <Card className="border border-neutral-100 rounded mb-4 dark:border-slate-700">
    <CardHeader className="border-b border-neutral-100 my-2 px-4 py-2 bg-[#0c8599]">
      <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-2">
        <CardTitle className="text-white text-base sm:text-lg font-semibold">
          Recent Sales
        </CardTitle>
        <Link
          to="/admin/sales-receipt?tab=see-sales"
          className="text-white text-sm sm:text-base font-medium hover:text-primary-800"
        >
          View All
        </Link>
      </div>
    </CardHeader>
  
    <CardContent className="p-0">
      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <Table className="min-w-[600px] sm:min-w-full">
          <TableHeader className="bg-neutral-50">
            <TableRow>
              {/* <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Invoice #</TableHead> */}
              <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Site Id</TableHead>
              <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Dispenser Name</TableHead>
              <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Amount</TableHead>
              <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Status</TableHead>
              <TableHead className="text-xs sm:text-sm font-medium text-neutral-500 uppercase whitespace-nowrap">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                  Loading recent sales...
                </TableCell>
              </TableRow>
            ) : sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-neutral-500">
                  No sales found
                </TableCell>
              </TableRow>
            ) : (
              sales.slice(0, 5).map((sale) => (
                <TableRow key={sale.saleId} className="hover:bg-neutral-50">
                  {/* <TableCell className="text-sm text-primary-700 whitespace-nowrap">{sale.saleId}</TableCell> */}
                  <TableCell className="text-sm text-neutral-700 whitespace-nowrap">{sale.siteId}</TableCell>
                  <TableCell className="text-sm text-neutral-700 whitespace-nowrap">{sale.cashier.name}</TableCell>
                  <TableCell className="text-sm text-neutral-700 whitespace-nowrap">{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell>
                    {/* Placeholder for status badge */}
                    <Badge variant="outline" className="bg-neutral-50 text-neutral-600 hover:bg-neutral-50 border-neutral-200">
                      Status
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-neutral-500 whitespace-nowrap">{sale.saleDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>  
  );
};

export default RecentSalesTable;
