import SearchGroup from '@/components/SearchGroup/SearchGroup';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { salesAgentTableRows, searchTransactionDataTableConditions, transactionDataActions } from '@/utils/constants';
import Actions from '@/components/Actions/Actions';
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
import DateSelect from '@/components/DateSelect/DateSelect';

const TransactionData: React.FC = () => {
  return (
    <section className="section">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Transaction Data</h4>
      </div>
      <hr />
      <div className=" border h-auto m-2 rounded dark:border-slate-700">
        <div className="flex items-center justify-center gap-4 my-2">
          <div className="w-[200px] flex items-center gap-2">
            <span className="text-xs dark:text-white">From:</span>
            <DateSelect />
          </div>
          <div className="w-[200px] flex items-center gap-2">
            <span className="text-xs dark:text-white">To:</span>
            <DateSelect />
          </div>
        </div>

        <div className="flex relative items-center gap-3 p-2">
          <SearchGroup data={searchTransactionDataTableConditions} />
          <Actions data={transactionDataActions} />

          <div className="flex items-center gap-1">
            <span className="text-xs">Rows:</span>
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue className="text-xs" placeholder="select rows" />
              </SelectTrigger>
              <SelectContent>
                {salesAgentTableRows.map((item, index) => {
                  return (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="table">
          <Table className="overflow-x-auto">
            <TableCaption>A list of your recent Vendors.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-[200px]">Billing Date</TableHead>
                <TableHead className="text-left">Sales Approval</TableHead>
                <TableHead className="text-left">Branch</TableHead>
                <TableHead className="text-left">Employee</TableHead>
                <TableHead className="text-left w-5">Product ID</TableHead>
                <TableHead className="text-left">Product Name</TableHead>
                <TableHead className="text-left">Latin Name</TableHead>
                <TableHead className="text-left">Strength</TableHead>
                <TableHead className="text-left">Pack size</TableHead>
                <TableHead className="text-left">Country</TableHead>
                <TableHead className="text-left">Class</TableHead>
                <TableHead className="text-left">Manufacturer</TableHead>
                <TableHead className="text-left">Unit</TableHead>
                <TableHead className="text-left">EAN</TableHead>
                <TableHead className="text-left">Department</TableHead>
                <TableHead className="text-left">Category</TableHead>
                <TableHead className="text-left">Condition</TableHead>
                <TableHead className="text-left">Seria</TableHead>
                <TableHead className="text-left">Expiry Date</TableHead>
                <TableHead className="text-left">QTY(Packs)</TableHead>
                <TableHead className="text-left">Selling value</TableHead>
                <TableHead className="text-left">Purchase value</TableHead>
                <TableHead className="text-left">Discount</TableHead>
                <TableHead className="text-left">Institution</TableHead>
                <TableHead className="text-left">Adjustment Type</TableHead>
                <TableHead className="text-left">Buffer</TableHead>
                <TableHead className="text-left">Transaction No.</TableHead>
                <TableHead className="text-left">In Stock</TableHead>
                <TableHead className="text-left">Vendor</TableHead>
                <TableHead className="text-left">Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default TransactionData;
