import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bufferReportADS, employeeNames } from '@/utils/constants';
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
import TextDataControls from '@/components/Text-data-controls/TextDataControls';

const CashReport: React.FC = () => {
  return (
    <section className="m-2 flex gap-4">
      <div className="border h-fit pb-2 rounded w-[720px]">
        <h4 className="p-3 font-medium">Parameters</h4>
        <hr />
        <div className="p-2 flex flex-col gap-2 w-full">
          <div className="flex items-center w-full">
            <div className="w-28 block text-right">
              <label htmlFor="date" className="text-right pr-3 text-xs font-medium">
                Select Date
              </label>
            </div>
            <div className="w-full">
              <DateSelect />
            </div>
          </div>
          <div className="flex items-center ">
            <div className="w-28 block text-right">
              <label className="pr-3 text-xs font-medium">Branch</label>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {bufferReportADS.map((item, index) => {
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
          <div className="flex items-start">
            <div className="w-28 block text-right">
              <p className="text-right pr-3 text-xs font-medium">Employee</p>
            </div>
            <TextDataControls textData={employeeNames} defaultText='Businge' />
            {/* <div className="w-full flex items-center justify-between">
              <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100">
                {remainingEmployees.map((employeeName, idx) => (
                  <li
                    className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300 ${selectedEmployee === employeeName ? 'bg-slate-300' : ''}`}
                    key={idx}
                    onClick={() => selectEmployee(employeeName)}
                  >
                    {employeeName}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={resetEmployees}
                >
                  <MdOutlineResetTv />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveAllEmployees('right')}
                >
                  <LuChevronsRight />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveSingleEmployee('right')}
                >
                  <LuChevronRight />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveSingleEmployee('left')}
                >
                  <LuChevronLeft />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveAllEmployees('left')}
                >
                  <LuChevronsLeft />
                </span>
              </div>
              <ul
                className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100"
                ref={selectedEmployeesRef}
              >
                {selectedEmployees.map((employeeName, idx) => (
                  <li
                    className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300`}
                    key={idx}
                    onClick={() => selectEmployee(employeeName)}
                  >
                    {employeeName}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollToTop}
                >
                  <RiSkipUpLine />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollUpOneItem}
                >
                  <LuChevronUp />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollDownOneItem}
                >
                  <LuChevronDown />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollToBottom}
                >
                  <RiSkipDownLine />
                </span>
              </div>
            </div> */}
          </div>
        </div>
        <div className="flex items-center justify-between m-2">
          <button className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark">Print</button>
          <div className="flex items-center gap-3">
            <button className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark">
              Payment Details
            </button>
            <button className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark">
              Report
            </button>
          </div>
        </div>
      </div>
      <div className="border pb-4 rounded w-[720px]">
        <h4 className="p-3 font-medium">Sales Report</h4>
        <hr />
        <div className="mb-4 mx-2 mt-4  border">
          <Table>
            <TableCaption>A list of your recent Invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Refund</TableHead>
                <TableHead>Sale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="font-medium">
                  Report Total
                </TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="mb-4 mt-4 m-2 border rounded">
          <Table>
            <TableCaption>A list of your recent Invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Paid</TableHead>
                <TableHead>Dispatch</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Cash at Hand</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-medium">
                  Report Total
                </TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="px-2 py-4 m-2 shadow-md rounded border">Dispatch(Not Paid)</div>
      </div>
    </section>
  );
};

export default CashReport;
