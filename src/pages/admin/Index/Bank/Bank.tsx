import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
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
import Actions from '@/components/Actions/Actions';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { bankActions, bankTableRows, searchBankTableConditions } from '@/utils/constants';
import Modal from '@/components/Modal/Modal';
import BankDetailsForm from '@/components/Forms/Bank/BankDetailsForm';

const Bank: React.FC = () => {
  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchBankTableConditions} />
            <Actions data={bankActions} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {bankTableRows.map((item, index) => {
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
          <button
            onClick={() => dispatch(onOpenModal())}
            type="button"
            className="bg-primary text-xs text-white px-2 py-2 shadow-lg rounded hover:bg-primary-dark"
          >
            <span className="block size-full">Create</span>
          </button>
        </div>
        <hr />
        <div className="mb-4 mt-4 h-auto m-2  border">
          <Table>
            <TableCaption>A list of your recent Vendors.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>-</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Phone</TableHead>
                <TableHead className="text-right">E-Mail</TableHead>
                <TableHead className="text-right">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
      {showModal && (
        <Modal title="Bank Details">
          <BankDetailsForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Bank;
