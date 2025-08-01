import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DateSelect,
  Table,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader/Loader';
import { formatCurrency, formatTimestamp } from '@/utils/formatter';
import { WebService } from '@/web-services/WebService';

const fetchShiftSales = async () => {
  const accountId = localStorage.getItem('account_id');
  const tillNo = localStorage.getItem('adsStation');
  const siteName = localStorage.getItem('siteName');

  const payload = {
    request: 'GET_SHIFT_SALES',
    shift: {
      pharmacy: {
        tillNo,
        name: siteName,
      },
      dispenser: {
        accountId,
      },
    },
    filterBy: 'DISPENSER',
  };

  const data  = await WebService.postPharma('pharma', payload);
  console.log("Shift sales response:", data);
  if (data.status) {
    return data.message;
  }
  throw new Error('Failed to fetch shift sales');
};

const DailySalesReport: React.FC = () => {
  const { data: dailySales, isLoading, isError, error } = useQuery({
    queryKey: ['shiftSales'],
    queryFn: fetchShiftSales,
    refetchOnWindowFocus: false,
  });

  // Track selected payment option and customer type for each sale
  const [selectedPaymentOptions, setSelectedPaymentOptions] = useState<Record<string, string>>({});
  const [selectedCustomerTypes, setSelectedCustomerTypes] = useState<Record<string, string>>({});

  // Initialize selected options with the first option when data loads
  useEffect(() => {
    if (dailySales && dailySales.length > 0) {
      const initialPaymentOptions: Record<string, string> = {};
      const initialCustomerTypes: Record<string, string> = {};

      dailySales.forEach((sale) => {
        if (sale.paymentOptions && sale.paymentOptions.length > 0) {
          initialPaymentOptions[sale.saleId] = sale.paymentOptions[0].paymentOp;
        }
        if (sale.customerType && sale.customerType.length > 0) {
          initialCustomerTypes[sale.saleId] = sale.customerType[0].customer;
        }
      });

      setSelectedPaymentOptions(initialPaymentOptions);
      setSelectedCustomerTypes(initialCustomerTypes);
    }
  }, [dailySales]);

  return (
    <section className="section">
      <div className="overflow-x-auto rounded-md border mx-1 my-3">
        <Table className="min-w-[900px]">
          <TableHeader className="bg-slate-100 whitespace-nowrap">
            <TableHead className="text-center">Payment Options</TableHead>
            <TableHead className="text-center">Amount</TableHead>
            <TableHead className="text-center">Count</TableHead>
            <TableHead className="text-center">Customer Type</TableHead>
            <TableHead className="text-center">Count</TableHead>
            <TableHead className="text-center">Total Amount</TableHead>
            <TableHead className="text-center">Cosmetics Sold</TableHead>
            <TableHead className="text-center">Total Discounts</TableHead>
            <TableHead className="text-center">Served Customers</TableHead>
            <TableHead className="text-center">Unserved Customers</TableHead>
            <TableHead className="text-center">Date</TableHead>
          </TableHeader>

          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan={11} className="py-8 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <Loader color="text-primary" />
                    <span className="text-sm text-slate-500">Loading sales, please wait...</span>
                  </div>
                </td>
              </tr>
            </tbody>
          )  : dailySales && dailySales.length > 0 ? (
            dailySales.map((sale) => (
              <tbody key={sale.saleId}>
                <TableRow>
                  <TableCell className="text-center">
                    {sale.paymentOptions.length > 1 ? (
                      <Select
                        value={selectedPaymentOptions[sale.saleId] || ''}
                        onValueChange={(value) =>
                          setSelectedPaymentOptions((prev) => ({ ...prev, [sale.saleId]: value }))
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue className="text-xs" placeholder="Select payment option..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sale.paymentOptions.map((payment) => (
                            <SelectItem key={payment.paymentOp} value={payment.paymentOp}>
                              {payment.paymentOp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      sale.paymentOptions[0]?.paymentOp
                    )}
                  </TableCell>
                  <TableCell className="text-center px-0">
                    {formatCurrency(
                      sale.paymentOptions.find((p) => p.paymentOp === selectedPaymentOptions[sale.saleId])
                        ?.amount || sale.paymentOptions[0]?.amount || 0,
                    )}
                  </TableCell>
                  <TableCell className="text-center px-0">
                    {sale.paymentOptions.find((p) => p.paymentOp === selectedPaymentOptions[sale.saleId])?.count ||
                      sale.paymentOptions[0]?.count}
                  </TableCell>
                  <TableCell className="text-center">
                    {sale.customerType.length > 1 ? (
                      <Select
                        value={selectedCustomerTypes[sale.saleId] || ''}
                        onValueChange={(value) =>
                          setSelectedCustomerTypes((prev) => ({ ...prev, [sale.saleId]: value }))
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue className="text-xs" placeholder="Select customer type..." />
                        </SelectTrigger>
                        <SelectContent>
                          {sale.customerType.map((c) => (
                            <SelectItem key={c.customer} value={c.customer}>
                              {c.customer}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      sale.customerType[0]?.customer
                    )}
                  </TableCell>
                  <TableCell className="text-center px-0">
                    {sale.customerType.find((c) => c.customer === selectedCustomerTypes[sale.saleId])?.count ||
                      sale.customerType[0]?.count}
                  </TableCell>
                  <TableCell className="text-center px-0">{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell className="text-center px-0">{sale.cosmetics}</TableCell>
                  <TableCell className="text-center px-0">{sale.totalDiscounts}</TableCell>
                  <TableCell className="text-center px-0">{sale.servedCustomers}</TableCell>
                  <TableCell className="text-center px-0">{sale.unservedCustomers}</TableCell>
                  <TableCell className="text-center whitespace-nowrap">{formatTimestamp(sale.timeStamp)}</TableCell>
                </TableRow>
              </tbody>
            ))
          ) : (
            <tbody>
              <tr>
                <td colSpan={11} className="text-center py-8">
                  No Sales found
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </section>
  );
};

export default DailySalesReport;
