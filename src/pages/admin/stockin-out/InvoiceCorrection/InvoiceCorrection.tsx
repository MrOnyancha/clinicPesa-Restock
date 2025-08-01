import React from 'react';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { MdOutlineResetTv } from 'react-icons/md';
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

const InvoiceCorrection: React.FC = () => {

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 ">
          <h4 className="section-heading">Invoice Correction</h4>
        </div>
        <hr />
        <div className="p-2  h-auto m-2 ">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={[]} />
              <Actions data={[]} />
            </div>
            <button className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </button>
          </div>
          <div className="table">
            <Table>
              <TableCaption>A list of your recent invoice corrections.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">-</TableHead>
                  <TableHead>Date of issue</TableHead>
                  <TableHead>Acceptance Date</TableHead>
                  <TableHead className="text-left">Invoice No.</TableHead>
                  <TableHead className="text-left">Corrected Document</TableHead>
                  <TableHead className="text-left">Vendor</TableHead>
                  <TableHead className="text-left">Operation</TableHead>
                  <TableHead className="text-left">Introduced</TableHead>
                  <TableHead className="text-left">Approved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8}>Total</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default InvoiceCorrection;
