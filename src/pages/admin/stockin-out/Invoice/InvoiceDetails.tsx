import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SearchableDropdown from '@/components/SearchableDropdown/SearchableDropdown';
import DateSelect from '@/components/DateSelect/DateSelect';
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
import { IoEyeOutline } from 'react-icons/io5';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import InvoiceDetailsForm from '@/components/Forms/stockinOut/Invoice/InvoiceDetailsForm';
import ProductDetailsForm from '@/components/Forms/stockinOut/Invoice/ProductDetailsForm';
import CreateProductForm from '@/components/Forms/products/CreateProductForm';

const InvoiceDetails: React.FC = () => {
  const [openModalTerm, setOpenModalTerm] = useState<string | null>(null);

  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-2 ">
        <div className="border rounded shadow mb-2">
          <div className="w-full px-4 py-2">
            <h4 className=" font-medium">Invoice No: 45698</h4>
          </div>
          <hr />
          <form className="p-4">
            <div className="flex w-full ">
              <div className="border-r pr-3">
                <div className="flex gap-2 items-center mb-1">
                  <div className="w-20 block text-right">
                    <label className="text-xs text-right">
                      <span className="text-red-500">*</span> Vendor
                    </label>
                  </div>
                  <div>
                    <SearchableDropdown options={[]} id="" selectedVal="" handleChange={() => {}} />
                  </div>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-20 block text-right">
                      <label className="text-xs text-right">Credit Limit</label>
                    </div>
                    <div className="w-[206px]">
                      <Input className="w-full bg-slate-100" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Currency</span>
                    <Select>
                      <SelectTrigger className="w-[206px]">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ugx">UGX</SelectItem>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="kes">KES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="w-full flex items-center justify-between">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-20 block text-right">
                      <label className="text-xs text-right">
                        <span className="text-red-500">*</span>
                        Invoice No.
                      </label>
                    </div>
                    <div className="w-[206px]">
                      <Input className=" w-full bg-slate-100 " />
                    </div>
                  </div>
                </div>
                <div className="w-full flex items-center gap-6 mb-2">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-20 block text-right">
                      <label className="text-xs text-right">Date of issue</label>
                    </div>
                    <div className="w-[206px]">
                      <DateSelect  />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mb-1">
                    <div className="w-24 block text-right">
                      <label className="text-xs text-right">Acceptance Date</label>
                    </div>
                    <div className="w-[206px]">
                      <DateSelect  />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex  gap-2 items-start mb-2 mt-2">
                  <div className="w-20 block text-right">
                    <label className="text-xs text-right">Comments</label>
                  </div>
                  <div className="w-5/6">
                    <Textarea />
                  </div>
                </div>
                <div className="flex gap-2 items-center mb-3">
                  <div className="w-20 block text-right">
                    <label className="text-xs text-right">
                      <span className="text-red-500">*</span> Invoice Value
                    </label>
                  </div>
                  <div className="w-1/3">
                    <Input className=" w-full bg-slate-100" />
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="w-full flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button className="btn-cancel">
                  Cancel
                </button>
                <button className="btn-danger">
                  Accept From The Buffer
                </button>

                <button className="btn-picking--list">
                  Picking List
                </button>
                <button className=" btn-primary">
                  Quick Fix
                </button>
              </div>
              <div className='flex gap-2 items-center'>
                <button className=" btn-outline">Delete</button>
                <button className=" btn-primary">Save</button>
              </div>
            </div>
          </form>
        </div>
        <div className="border rounded">
          <Table className="mb-3">
            <TableCaption>A list of your recent products in invoice No:45698.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">-</TableHead>
                <TableHead className="w-[40px]">-</TableHead>
                <TableHead className="text-left">ID</TableHead>
                <TableHead className="text-left w-[200px]">Products</TableHead>
                <TableHead className="text-left">Expiry Date</TableHead>
                <TableHead className="text-left">Serial No.</TableHead>
                <TableHead className="text-left">Quantity(GRN)</TableHead>
                <TableHead className="text-left">Price</TableHead>
                <TableHead className="text-left">Retail Price</TableHead>
                <TableHead className="text-left">Margin(%)</TableHead>
                <TableHead className="text-left">Net Value</TableHead>
                <TableHead className="text-left">VAT</TableHead>
                <TableHead className="text-left">Value</TableHead>
                <TableHead className="w-[40px]">-</TableHead>
                <TableHead className="w-[40px]">-</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      setOpenModalTerm('search');
                      dispatch(onOpenModal());
                    }}
                  >
                    <IoEyeOutline size={20} />
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className="cursor-pointer text-primary-dark italic"
                    onClick={() => {
                      setOpenModalTerm('productId');
                      dispatch(onOpenModal());
                    }}
                  >
                    34533
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    onClick={() => {
                      setOpenModalTerm('viewProduct');
                      dispatch(onOpenModal());
                    }}
                  >
                    MALAREN /NEOSIDAR
                  </span>
                </TableCell>
                <TableCell>
                  <img
                    src="/assets/pencil.png"
                    onClick={() => {
                      setOpenModalTerm('details');
                      dispatch(onOpenModal());
                    }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={10}>Total</TableCell>
                <TableCell className="text-left">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <button type="button" className="btn-primary">
            ADD
          </button>
        </div>
      </section>
      {showModal && openModalTerm === 'search' && (
        <Modal title="Product Details">
          <ProductDetailsForm />
        </Modal>
      )}
      {showModal && openModalTerm === 'viewProduct' && (
        <Modal title="Edit Product">
          <CreateProductForm />
        </Modal>
      )}
      {showModal && openModalTerm === 'productId' && <Modal title="Invoice Transaction">tdg</Modal>}
      {showModal && openModalTerm === 'details' && (
        <Modal title="Invoice Details">
          <InvoiceDetailsForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default InvoiceDetails;
