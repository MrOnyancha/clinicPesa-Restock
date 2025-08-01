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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { salesAgentTableRows } from '@/utils/constants';
import Actions from '@/components/Actions/Actions';

const ProductList: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Product List</h4>
      </div>
      <hr />
      <div className=" border h-auto m-2 rounded">
        <div className="flex relative items-center gap-3 p-2">
          <SearchGroup data={[]} />
          <Actions data={[]} />
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
        <div className=" mt-4 border-t">
          <Table className="overflow-x-auto">
            <TableCaption>A list of your recent products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Latin Name</TableHead>
                <TableHead>Strength</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>SAH</TableHead>
                <TableHead>RP</TableHead>
                <TableHead>CP</TableHead>
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

export default ProductList;
