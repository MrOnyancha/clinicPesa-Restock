import React from 'react';
import CreateDeliveryNoteForm from '@/components/Forms/stockinOut/DeliveryNote/CreateDeliveryNoteForm';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { useModalDispatch, useModalSelector } from '@/store/hooks';

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
import { searchDeliveryNoteTableConditons } from '@/utils/constants';
import { Button } from '@/components/ui/button';

const DeliveryNote: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="section-heading">Delivery Note</h4>
          <Button
            variant="default"
            onClick={() => dispatch(onOpenModal())}
            type="button"
            // className="bg-primary text-white p-2 text-xs  active:bg-primary shadow-lg rounded hover:bg-primary-dark"
          >
            <span className="block size-full">Create</span>
          </Button>
        </div>
        <hr />
        <div className="p-2  h-auto m-2">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={searchDeliveryNoteTableConditons} />
              <Actions data={[]} />
            </div>
            <Button
              variant="secondary"
              type="button"

              // className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300"
            >
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </Button>
          </div>
          <div className="mb-4 mt-4 w-full border dark:border-slate-700">
            <Table>
              <TableCaption>A list of your recent Customers.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">-</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Introduced</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={7}>Total</TableCell>
                  <TableCell>$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
      {showModal && (
        <Modal title="Delivery Note">
          <CreateDeliveryNoteForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DeliveryNote;
