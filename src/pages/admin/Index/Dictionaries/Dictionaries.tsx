import React, { useState } from 'react';
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
import { ImPencil2 } from 'react-icons/im';
import ProductClassForm from '@/components/Forms/Dictionaries/ProductClassForm';
import CustomerClassForm from '@/components/Forms/Dictionaries/CustomerClassForm';

const Dictionaries: React.FC = () => {
  const [modalType, setModalType] = useState<string>('');
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="p-3 flex w-full justify-between items-center gap-3">
        <div className="shadow h-auto w-full rounded border border-slate-200">
          <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className=" font-medium">Product Class</h4>
            <button
              onClick={() => {
                setModalType('product');
                dispatch(onOpenModal());
              }}
              type="button"
              className="bg-primary text-xs text-white px-2 py-2 shadow-lg rounded hover:bg-primary-dark"
            >
              <span className="block size-full">Create</span>
            </button>
          </div>
          <div className="m-4 rounded border border-slate-200">
            <Table>
              <TableCaption>A list of your recent Product classes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead className="text-left w-full">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="w-full  hover:bg-slate-200 transition-all duration-300">
                  <TableCell className="font-medium ">
                    <ImPencil2 />
                  </TableCell>
                  <TableCell>Paid</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
        <div className="shadow h-auto w-full rounded border border-slate-200">
          <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className=" font-medium">Customer Class</h4>
            <button
              onClick={() => {
                setModalType('customer');
                dispatch(onOpenModal());
              }}
              type="button"
              className="bg-primary text-xs text-white px-2 py-2 shadow-lg rounded hover:bg-primary-dark"
            >
              <span className="block size-full">Create</span>
            </button>
          </div>
          <div className="m-4 rounded border border-slate-200">
            <Table>
              <TableCaption>A list of your Customer classes.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead className="text-left">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="w-full  hover:bg-slate-200 transition-all duration-300">
                  <TableCell className="font-medium ">
                    <ImPencil2 />
                  </TableCell>
                  <TableCell>Paid</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8}>Total</TableCell>
                  <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>

      {showModal && modalType === 'product' && (
        <Modal title="Edit Product Class">
          <ProductClassForm />
        </Modal>
      )}
      {showModal && modalType === 'customer' && (
        <Modal title="Edit Customer Class">
          <CustomerClassForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Dictionaries;
