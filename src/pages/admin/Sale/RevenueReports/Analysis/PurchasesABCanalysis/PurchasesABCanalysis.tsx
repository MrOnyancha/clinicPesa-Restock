import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
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

const PurchasesABCanalysis: React.FC = () => {
  return (
    <section className="m-2 flex gap-4">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div>
          <span className="text-xs">Choose Date</span>
          <DateSelect />
        </div>
        <button className="flex items-center justify-center mt-4 bg-primary  text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
          Refresh
        </button>
      </aside>
      <div className="w-full border rounded m-2">
        <h4 className="font-medium p-2">Purchase Analysis</h4>
        <hr />
        <div className="mb-4 mt-4 m-2 border rounded">
          <Table>
            <TableCaption>A list of your recent purchases.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead className="w-[200px]">Product</TableHead>
                <TableHead>sah</TableHead>
                <TableHead className='w-[20px]'>Pack</TableHead>
                <TableHead>Sold Unit</TableHead>
                <TableHead>Sold Pack</TableHead>
                <TableHead className="w-[200px]">Purchase Value (Annual Demand)</TableHead>
                <TableHead>Selling Value</TableHead>
                <TableHead className="w-[200px]">Percentage Of Total Usage</TableHead>
                <TableHead>Cummulative % Of Total</TableHead>
                <TableHead className="w-[20px]">Grouping</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-medium">
                  Report Total
                </TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default PurchasesABCanalysis;
