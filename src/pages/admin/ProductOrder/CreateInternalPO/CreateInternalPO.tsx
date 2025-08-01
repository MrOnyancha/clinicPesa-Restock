import React from 'react';
import Actions from '@/components/Actions/Actions';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
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
import { createInternalPOActions, searchCreateInternalPOTableConditions } from '@/utils/constants';

const CreateInternalPO: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Create Internal PO</h4>
        <div className="flex gap-4">
          <button
            onClick={() => {}}
            type="button"
            className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark  active:bg-primary"
          >
            <span className="block size-full">Recalculate</span>
          </button>
          <button
            onClick={() => {}}
            type="button"
            className="bg-primary font-medium text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark  active:bg-primary"
          >
            <span className="block size-full">Clear</span>
          </button>
        </div>
      </div>
      <hr />
      <div className="w-full px-4 pt-2 pb-2 flex gap-10">
        <div className="flex gap-4">
          <button
            onClick={() => {}}
            type="button"
            className="bg-primary font-medium text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark active:bg-primary"
          >
            <span className="block size-full">Generate Deficiencies</span>
          </button>
          <button
            onClick={() => {}}
            type="button"
            className="bg-[#ffc628] font-medium text-black p-2 text-xs shadow-lg rounded hover:bg-[#ffd45b] active:bg-[#ffbf0f]"
          >
            <span className="block size-full">Send</span>
          </button>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-xs font-medium">
            Sales from: <span className="text-sm font-semibold">2024-03-11</span>
          </p>
          <p className="text-xs font-medium">
            to: <span className="text-sm font-semibold">2024-03-18</span>
          </p>
        </div>
      </div>
      <div className=" border h-auto m-2 rounded">
        <div className="flex items-center justify-between p-2">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchCreateInternalPOTableConditions} />
            <Actions data={createInternalPOActions} />
            <button className="bg-slate-100 p-2 text-xs border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
              Info
            </button>
            <button
              onClick={() => {}}
              type="button"
              className="bg-primary font-medium text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark active:bg-primary"
            >
              <span className="block size-full">Save</span>
            </button>
          </div>
          <button className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
            <span>
              <MdOutlineResetTv size={18} />
            </span>
            Reset
          </button>
        </div>
        <div className="mb-4 mt-4 w-full border-t">
          <Table>
            <TableCaption>A list of your recent PO's.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">ID</TableHead>
                <TableHead className="text-left">Products</TableHead>
                <TableHead className="text-left">Departments</TableHead>
                <TableHead className="text-left">Category</TableHead>
                <TableHead className="text-left">Condition</TableHead>
                <TableHead className="text-left">Pack size</TableHead>
                <TableHead className="text-left">Sale History(unit)</TableHead>
                <TableHead className="text-left">SAH (uinit)</TableHead>
                <TableHead className="text-left">Suggested QTY</TableHead>
                <TableHead className="text-left">Suggested Pack</TableHead>
                <TableHead className="text-left">QTY to order(unit)</TableHead>
                <TableHead className="text-left">QTY to order(Packs)</TableHead>
                <TableHead className="text-left">Last Order</TableHead>
                <TableHead className="text-left">Comment</TableHead>
                <TableHead className="text-left">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default CreateInternalPO;
