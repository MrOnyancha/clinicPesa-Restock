import React from 'react';
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
import Modal from '@/components/Modal/Modal';
import { productGroupActions, searchProductGroupTableConditions } from '@/utils/constants';
import ProductGroupForm from '@/components/Forms/ProductGroup/ProductGroupForm';

const ProductGroup: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Product Group</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(onOpenModal())}
              type="button"
              className="btn-primary"
            >
              <span className="block size-full">Create</span>
            </button>
          </div>
        </div>
        <hr />
        <div className="p-2 border h-auto m-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={searchProductGroupTableConditions} />
              <Actions data={productGroupActions} />
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
              <TableCaption>A list of your recent Customers.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead>Short Name</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Comment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
      {showModal && (
        <Modal title="Product Group Details">
          <ProductGroupForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default ProductGroup;
