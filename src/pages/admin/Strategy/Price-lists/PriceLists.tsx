import React from 'react';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { MdOutlineResetTv } from 'react-icons/md';
import { specialOfferActions } from '@/utils/constants';

const PriceLists: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Price Lists</h4>
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(onOpenModal())} type="button" className="btn-primary">
              <span className="block size-full">Create</span>
            </button>
          </div>
        </div>
        <hr />
        <div className="p-2 border h-auto m-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={['All text columns', 'Symbol', 'Name', 'Comment']} />
              <Actions data={specialOfferActions} />
            </div>
            <button className="flex items-center btn-outline">
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </button>
          </div>
          <div className="mb-4 mt-4 w-full border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>-</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell>$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
      {showModal && <Modal title="Add to Price List">fsdfsa</Modal>}
    </React.Fragment>
  );
};

export default PriceLists;
