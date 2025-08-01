import React, { useState } from 'react';
import Actions from '@/components/Actions/Actions';
import { Input } from '@/components/ui/input';
import { MdOutlineResetTv, MdSummarize } from 'react-icons/md';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { stockAtHandTableRows } from '@/utils/constants';
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
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import Modal from '@/components/Modal/Modal';
import { onCloseModal, onOpenModal } from '@/components/Modal/modalSlice';
import { Textarea } from '@/components/ui/textarea';
import ProductDetailsForm from '@/components/Forms/stockinOut/Invoice/ProductDetailsForm';

const Inventory: React.FC = () => {
  const [modalType, setModalType] = useState<string>('');
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="m-2 p-2">
        <div className="border rounded shadow">
          <div className="w-full px-4 py-2 mb-1">
            <h4 className="font-medium">Inventory</h4>
          </div>
          <hr />
          <div className="p-2">
            <div className="flex items-center justify-around">
              <p className="text-xs">
                Date: <span className="font-medium text-sm">2024-04-02</span>
              </p>
              <p className="text-xs">
                Created By: <span className="font-medium text-sm">Businge Bisanga</span>
              </p>
              <p className="text-xs">Product Group:</p>
            </div>
            <div className="flex items-center justify-between py-2">
              <button className="btn-cancel" type="button">
                Cancel
              </button>
              <div className="flex items-center gap-2 ">
                <button type="button" className="btn-outline flex items-center gap-2">
                  <span>
                    <MdOutlineResetTv />
                  </span>
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalType('sc-function');
                    dispatch(onOpenModal());
                  }}
                  className="btn-primary"
                >
                  SC Function
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalType('summary');
                    dispatch(onOpenModal());
                  }}
                  className="btn-yellow flex items-center gap-2"
                >
                  Summary
                  <span>
                    <MdSummarize />
                  </span>
                </button>
                <button type="button" className="btn-danger">
                  Accept SC
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border rounded mt-2 ">
          <div className="py-2 flex items-center gap-3 p-2">
            <div className="flex items-center border border-l-0 rounded h-8 ">
              <Input style={{ borderRadius: '0px' }} />
              <button type="button" className="px-2 cursor-pointer hover:bg-slate-100 h-full">
                Go
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {stockAtHandTableRows.map((item, index) => {
                    return (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Actions data={[]} />
          </div>
          <div className="mb-4 w-full border-t">
            <Table>
              <TableCaption>A list of your recent Inventories.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead className="w-[250px]">Products</TableHead>
                  <TableHead className="text-center p-0">Inv Bef</TableHead>
                  <TableHead className="flex items-center justify-center flex-col">
                    <span>INV Act</span>
                    <span>Packs | Units</span>
                  </TableHead>
                  <TableHead>Difference</TableHead>
                  <TableHead>Change of value</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>172</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setModalType('product');
                        dispatch(onOpenModal());
                      }}
                      className="text-primary cursor-pointer"
                    >
                      COFTA 1mg 100 Tablet
                    </span>
                  </TableCell>
                  <TableCell className="px-0 text-center">2</TableCell>
                  <TableCell className="flex items-center justify-center gap-1 px-0">
                    <Input type="number" className="w-[70px] h-7" />
                    <Input type="number" className="w-[70px] h-7" />
                  </TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>
                    <img
                      src="/assets/pencil.png"
                      height={18}
                      width={18}
                      className="cursor-pointer"
                      onClick={() => {
                        setModalType('edit');
                        dispatch(onOpenModal());
                      }}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
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
      {showModal && modalType === 'edit' && (
        <Modal title="Expiry Date/ Serial No.">
          <div className="w-fit mb-4">
            <div className="mx-3 my-2 flex items-center justify-around">
              <div>
                <p className="text-xs">
                  Product: <span className="text-sm font-medium">COFTA</span>
                </p>
                <p className="text-xs ">
                  Latin Name: <span className="text-sm font-medium">Ammonium Chloride</span>
                </p>
                <p className="text-xs">
                  Strength: <span className="text-sm font-medium">1mg</span>
                </p>
                <p className="text-xs">
                  Country: <span className="text-sm font-medium">Kenya</span>
                </p>
                <p className="text-xs">
                  Barcode: <span className="text-sm font-medium"></span>
                </p>
              </div>
              <div>
                <p className="text-xs">
                  Package: <span className="text-sm font-medium">100</span>
                </p>
                <p className="text-xs">
                  Unit: <span className="text-sm font-medium">Tablet</span>
                </p>
                <p className="text-xs">
                  Manufacturer: <span className="text-sm font-medium">GlaxoSmithKlein</span>
                </p>
                <p className="text-xs">
                  Class: <span className="text-sm font-medium"></span>
                </p>
              </div>
            </div>
            <div className="flex items-start mb-2 gap-2 mx-3">
              <span className="text-xs">Comments</span>
              <Textarea />
            </div>
            <div className="mx-2 border rounded">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice No.</TableHead>
                    <TableHead>Date of issue</TableHead>
                    <TableHead>INV Bef</TableHead>
                    <TableHead>INV Act</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Serial No.</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Clinipesa</TableCell>
                    <TableCell>00006</TableCell>
                    <TableCell>2024-03-14</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>200</TableCell>
                    <TableCell>2026-03-14</TableCell>
                    <TableCell>346665</TableCell>
                    <TableCell>4500</TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={7}>Total</TableCell>
                    <TableCell>$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <div className="flex items-center justify-between p-2">
              <button onClick={() => dispatch(onCloseModal())} type="button" className="btn-outline">
                Close
              </button>
              <button className="btn-primary" type="button">
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showModal && modalType === 'product' && (
        <Modal title="Product">
          <ProductDetailsForm />
        </Modal>
      )}
      {showModal && modalType === 'summary' && (
        <Modal title="Dep't Summary">
          <div className="m-2 border rounded pb-4">
            <Table>
              {/* <TableCaption>A list of the department summary</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category</TableHead>
                  <TableHead className="flex items-start flex-col">
                    <span>GRASS</span> <span>Before Value</span>
                  </TableHead>
                  <TableHead>After Value</TableHead>
                  <TableHead className="flex items-start flex-col">
                    <span>NET</span> <span>Before Value</span>
                  </TableHead>
                  <TableHead>After Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>0. Pharma</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell>Report Total</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                  <TableCell>1,468,488.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <hr />
            <span className="text-xs cursor-pointer hover:underline p-4 text-primary">Download</span>
          </div>
        </Modal>
      )}
      {showModal && modalType === 'sc-function' && (
        <Modal title="">
          <div className="m-2">
            <span className="text-xs">Are you sure? INV Act=INV Bef</span>
            <hr />
            <div className="flex items-center my-2 justify-end gap-3">
              <button
                onClick={() => {
                  setModalType('');
                  dispatch(onCloseModal());
                }}
                type="button"
                className="btn-cancel"
              >
                Cancel
              </button>
              <button type="button" className="btn-primary">
                OK
              </button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Inventory;
