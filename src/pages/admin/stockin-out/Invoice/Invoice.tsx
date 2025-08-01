import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ComboBox from '@/components/combo-box/ComboBox';
import { useTDispatch, useTSelector } from '@/store/hooks';
import { classesList } from '../../Sale/saleRouteSlice';
import { customersList } from '../../Index/Customers/customerSlice';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const Invoice: React.FC = () => {
  const clasess = useTSelector((state) => state.items.classes.items);
  const customers = useTSelector((state) => state.customers.customers);
  const itemDispatch = useTDispatch();

  useEffect(() => {
    itemDispatch(classesList(undefined));
  }, [itemDispatch]);

  useEffect(() => {
    itemDispatch(customersList(undefined));
  }, [itemDispatch]);

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="section-heading">Invoice</h4>
        </div>
        <hr />

        <div className="p-2 h-fit m-2">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-xs text-nowrap">Customer:</span>
              <ComboBox data={customers} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-nowrap">Class:</span>
              <ComboBox data={clasess} />
            </div>
          </div>
          <div className="py-2">
            <div className="w-3/4 flex items-center justify-between mt-2">
              <div className="flex items-center gap-5">
                <span className="pr-2 text-xs">Date:</span>
                <DateSelect />
              </div>
              <div className="flex items-center gap-1">
                <span className="pl-4 pr-2 text-xs text-nowrap">P.O No:</span>
                <Input className="w-206px]full bg-slate-100" />
              </div>
              <div className="flex items-center gap-1">
                <span className="pl-4 pr-2 text-xs text-nowrap">Invoice No.</span>
                <Input className="w-206px]full bg-slate-100" />
              </div>
              <div className="flex items-center gap-1">
                <span className="pl-4 pr-2 text-xs text-nowrap">F.O.B:</span>
                <Input className="w-206px]full bg-slate-100" />
              </div>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-between mt-2">
            <div className="flex items-start gap-1 w-full">
              <label className="pr-2 text-xs text-nowrap">Bill To:</label>
              <Textarea />
            </div>
          </div>
          <div className="mb-4 mt-4 w-full border dark:border-slate-700">
            <Table>
              <TableCaption>A list of your recent Invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead className="text-left">Item Code</TableHead>
                  <TableHead className="text-left">Site</TableHead>
                  <TableHead className="text-left">Quantity</TableHead>
                  <TableHead className="text-left">LOT Number</TableHead>
                  <TableHead className="text-left">U/M</TableHead>
                  <TableHead className="text-left">Description</TableHead>
                  <TableHead className="text-left">Price Each</TableHead>
                  <TableHead className="text-left">Class</TableHead>
                  <TableHead className="text-left">Amount</TableHead>
                  <TableHead className="text-left">Expiration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10}>Payments Applied</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10}>Balance Due</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <div className="flex gap-3 items-center justify-end w-full p-3">
              <Button variant="outline" type="button">
                Save & Exit
              </Button>
              <Button variant="default" type="submit">
                Save & New
              </Button>
              <Button variant="danger" type="button">
                Clear
              </Button>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Invoice;
