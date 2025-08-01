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

const AutomaticOrders:React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Automatic Orders</h4>
        <button
          onClick={() => {}}
          type="button"
          className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
        >
          <span className="block size-full">Create</span>
        </button>
      </div>
      <hr />
      <div className="px-4 pt-2 pb-2">
        <label htmlFor="displayservices" className="flex items-center gap-1">
          <input
            type="checkbox"
            value=""
            id="displayservices"
            name="displayservices"
            className="w-4 h-4 text-text-color bg-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className="text-sm">Archive</span>
        </label>
      </div>
      <div className="border h-auto m-2 rounded">
        <div className="mb-4  w-full">
          <Table>
            <TableCaption>A list of your recent Automatic Orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">Link</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Date of Generation</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>W1</TableHead>
                <TableHead>W2</TableHead>
                <TableHead>Autozam</TableHead>
                <TableHead>LPO Code</TableHead>
                <TableHead>Currency</TableHead>
                <TableHead>ABC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>Total</TableCell>
                <TableCell>$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
}

export default AutomaticOrders