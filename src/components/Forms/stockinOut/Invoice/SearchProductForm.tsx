import { Input } from '@/components/ui/input';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
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

const SearchProductForm: React.FC = () => {
  return (
    <form className="p-4 w-auto min-h-[400px]">
      <div className="flex items-center gap-2">
        <Input />
        <div className="h-8 w-8 bg-slate-100 hover:bg-slate-200 cursor-pointer border rounded flex items-center justify-center">
          <span>
            <IoSearchOutline />
          </span>
        </div>
      </div>
      <Table>
        <TableCaption>A list of your products.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="text-left">Name</TableHead>
            <TableHead className="text-left">SAH</TableHead>
            <TableHead className="text-left">Latin Name</TableHead>
            <TableHead className="text-left">Strength</TableHead>
            <TableHead className="text-left">Package</TableHead>
            <TableHead className="text-left">Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow></TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell className="text-left">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </form>
  );
};

export default SearchProductForm;
