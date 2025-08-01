import React from 'react'
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

const ApAgingReprt:React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Accounts Payable Aging Report</h4>
        <button
          onClick={() => {}}
          type="button"
          className="bg-primary text-xs text-white px-3 py-2 shadow-lg rounded hover:bg-primary-dark"
        >
          <span className="block size-full font-medium">PDF</span>
        </button>
      </div>
      <hr />
      <div className="mb-4 mt-4 h-auto m-2  border">
        <Table className='mb-4'>
          <TableCaption>A list of your recent Aging reports</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>-</TableHead>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead >Vendor</TableHead>
              <TableHead >Terms (Days)</TableHead>
              <TableHead >Limit</TableHead>
              <TableHead >To the Limit</TableHead>
              <TableHead >Current</TableHead>
              <TableHead >Aged 0-30</TableHead>
              <TableHead >Aged 31-60</TableHead>
              <TableHead >Aged 61-</TableHead>
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
}

export default ApAgingReprt