import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const Currency: React.FC = () => {
  const [showEditOptions, setShowEditOptions] = useState<boolean>(false);
  const [showChangeHistory, setShowChangeHistory] = useState<boolean>(false);
  return (
    <section className="m-2 p-2 rounded border">
      <div className="w-full px-4 pt-2 pb-2 ">
        <h4 className=" font-medium">Currency</h4>
      </div>
      <Table className="border rounded">
        <TableHeader>
          <TableRow>
            <TableHead>-</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <img
                src="/assets/pencil.png"
                width={18}
                height={18}
                className="cursor-pointer"
                onClick={() => setShowEditOptions((prev) => !prev)}
              />
            </TableCell>
            <TableCell>USD</TableCell>
            <TableCell>4100</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="flex items-center justify-end mt-2">
        <div className="w-[300px]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-nowrap">Round when selling to x places</span>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="select value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button type="button" className="btn-primary">
            Save
          </button>
        </div>
      </div>
      {showEditOptions && (
        <div className="shadow rounded p-2 border w-[600px] mx-auto my-3">
          <h4 className=" font-medium pb-2">Edit Options</h4>
          <hr />
          <div className="flex gap-2 items-center my-3 justify-center">
            <div className="flex items-center gap-2">
              <label className="text-xs flex items-center">
                <span className="text-red-500">*</span> Currency:
              </label>
              <span className="font-bold text-sm">USD</span>
            </div>
            <div className="flex gap-2 items-center mb-1">
              <div className="w-24 block text-right">
                <label className="text-xs text-right">
                  <span className="text-red-500">*</span> Value
                </label>
              </div>
              <div className="w-5/6">
                <Input type="number" className=" bg-slate-100 w-full" />
              </div>
            </div>
          </div>
          <hr />
          <div className="flex items-center justify-between my-4">
            <button onClick={() => setShowEditOptions(false)} type="button" className="btn-cancel">
              Cancel
            </button>
            <button onClick={() => setShowChangeHistory((prev) => !prev)} type="button" className="btn-outline">
              Change History
            </button>
            <button type="button" className="btn-primary">
              Apply changes
            </button>
          </div>
        </div>
      )}
      {showChangeHistory && (
        <div className="shadow rounded p-2 border w-[600px] mx-auto my-3">
          <h4 className=" font-medium pb-2">Change History</h4>
          <span>No data found</span>
        </div>
      )}
    </section>
  );
};

export default Currency;
