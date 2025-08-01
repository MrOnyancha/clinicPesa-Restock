import React from 'react';
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
import { AiOutlineExpandAlt } from 'react-icons/ai';

const InventoryValuation: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Warehouse Report</h4>
        <button
          type="button"
          className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
        >
          <span>
            <AiOutlineExpandAlt size={20} />
          </span>
        </button>
      </div>
      <hr />
      <div className="mb-4 mt-4 h-auto m-2  border">
        <Table>
          <TableCaption>A list of your recent Inventory evaluations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead className="w-[400px]">Net Invoice Value </TableHead>
              <TableHead className="w-[250px]">VAT</TableHead>
              <TableHead className="text-right">VAT Amount</TableHead>
              <TableHead className="text-right">Item value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </section>
  );
};

export default InventoryValuation;
