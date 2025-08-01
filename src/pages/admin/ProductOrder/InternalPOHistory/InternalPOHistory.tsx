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
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { MdOutlineResetTv } from 'react-icons/md';
import { internationalPOHistoryActions, searchInternalPOHistoryTableConditions } from '@/utils/constants';

const InternalPOHistory: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 ">
        <h4 className=" font-medium">International PO History</h4>
      </div>
      <hr />
      <div className="p-2 border h-auto m-2 rounded">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchInternalPOHistoryTableConditions} />
            <Actions data={internationalPOHistoryActions} />
          </div>
          <button className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
            <span>
              <MdOutlineResetTv size={18} />
            </span>
            Reset
          </button>
        </div>
        <div className="mb-4 mt-4 w-full border">
          <Table>
            <TableCaption>A list of your recent PO's.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>-</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell>$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default InternalPOHistory;
