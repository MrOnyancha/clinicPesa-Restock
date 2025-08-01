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
import { specialOfferActions } from '@/utils/constants';

const GHLPriceList: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 ">
        <h4 className=" font-medium">GHL Price List</h4>
      </div>
      <hr />
      <div className="p-2 border h-auto m-2 rounded">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={['All text columns', 'Type', 'Product']} />
            <Actions data={specialOfferActions} />
            <button type="button" className="btn-outline">
              Edit
            </button>
            <button type="button" className="btn-primary">
              Save
            </button>
          </div>
          <button className="flex items-center btn-outline">
            <span>
              <MdOutlineResetTv size={18} />
            </span>
            Reset
          </button>
        </div>
        <div className="p-2 border my-2"></div>
        <div className="mb-4 mt-4 w-full border">
          <Table>
            <TableCaption>A list of your recent special offers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Margin</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Average Price</TableHead>
                <TableHead>Percent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default GHLPriceList;
