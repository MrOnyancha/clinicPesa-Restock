import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { paymentVoucherActions, salesAgentTableRows, searchPaymentVoucherTableConditions } from '@/utils/constants';
import Actions from '@/components/Actions/Actions';

const PaymentVoucher: React.FC = () => {
  return (
    <section className="m-4 shadow flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Options</h4>
        <div className="mt-2 h-fit w-full">
          <div className="mt-4 mb-4">
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="All" id="all" />
                <label htmlFor="all" className="text-xs">
                  All
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="Approved" id="approved" />
                <label htmlFor="approved" className="text-xs">
                  Approved
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="For Approval" id="forApproval" />
                <label htmlFor="forApproval" className="text-xs">
                  For Approval
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="To Be Verified" id="toBeVerified" />
                <label htmlFor="toBeVerified" className="text-xs">
                  To Be Verified
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </aside>
      <div className="m-2 p-2 border rounded flex-1">
        <div className="flex relative items-center gap-3">
          <SearchGroup data={searchPaymentVoucherTableConditions} />
          <Actions data={paymentVoucherActions} />
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
        {/* <div className="mb-4 mt-4 h-auto m-2  border">
          <Table>
            <TableCaption>A list of your recent Vendors.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>-</TableHead>
                <TableHead className="w-[400px]">Name</TableHead>
                <TableHead className="w-[250px]">Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Mail</TableHead>
                <TableHead>Currency</TableHead>
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
        </div> */}
      </div>
    </section>
  );
};

export default PaymentVoucher;
