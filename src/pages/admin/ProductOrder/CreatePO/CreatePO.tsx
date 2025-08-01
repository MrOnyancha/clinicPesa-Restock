import React from 'react';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import SearchCondtions from '@/components/SearchConditons/SearchCondtions';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { HiChevronDown } from 'react-icons/hi';
import { MdOutlineResetTv } from 'react-icons/md';
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
import { createPOActions, searchCreatePOTableConditions } from '@/utils/constants';

const CreatePO: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Shortages Global</h4>
          <button
            onClick={() => dispatch(onOpenModal())}
            type="button"
            className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
          >
            <span className="block size-full">Create</span>
          </button>
        </div>
        <hr />
        <div className="p-2 border h-auto m-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={searchCreatePOTableConditions} />
              <Actions data={createPOActions} />
            </div>
            <button className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </button>
          </div>
          <div className="mb-4 mt-4 w-full border">
            <Table>
              <TableCaption>A list of your recent PO's.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Comments</TableHead>
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
          </div>
        </div>
      </section>
      {showModal && <Modal title="Step-1">g</Modal>}
    </React.Fragment>
  );
};

export default CreatePO;
