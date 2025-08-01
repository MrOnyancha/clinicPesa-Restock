import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bufferReportADS } from '@/utils/constants';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { FaList } from 'react-icons/fa';
import DateSelect from '@/components/DateSelect/DateSelect';

const Transactions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCreditNoteBtn, setActiveCreditNoteBtn] = useState<string>('All');

  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-2 py-2 h-auto border rounded">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Transactions</h4>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {}}
              type="button"
              className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
            >
              <span className="block size-full">Export</span>
            </button>
            <button
              onClick={() => {}}
              type="button"
              className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
            >
              <span className="block size-full">Clear</span>
            </button>
          </div>
        </div>
        <hr />
        <div className="my-2 flex items-center justify-evenly">
          <div className="flex flex-col gap-2">
            <div className="flex items-center ">
              <div className="w-28 block text-right">
                <label htmlFor="barcode" className="text-right pr-3 text-xs font-medium">
                  Barcode/Symbol
                </label>
              </div>
              <div className="w-[220px]">
                <Input defaultValue={0} name="barcode" id="barcode" className="w-full" />
              </div>
            </div>
            <div className="flex items-center ">
              <div className="w-28 block text-right">
                <label className="pr-3 text-xs font-medium">Branch</label>
              </div>
              <div className="">
                <Select>
                  <SelectTrigger className="w-[220px]">
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
            <div className="flex items-center ">
              <div className="w-28 block text-right">
                <label htmlFor="dealer" className=" text-xs pr-3 font-medium">
                  Dealer
                </label>
              </div>
              <div className="flex items-center gap-2 w-[220px]">
                <Input
                  name="dealer"
                  id="dealer"
                  placeholder="All"
                  value=""
                  onChange={(e) => {
                    if (e.type) {
                      // dispatch(onOpenModal());
                    }
                    // setSearchTerm(e.target.value);
                  }}
                />
                <span
                  // onClick={() => dispatch(onOpenModal())}
                  className="cursor-pointer"
                >
                  <FaList size={20} />
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-28 block text-right">
                <label htmlFor="paid" className="text-xs font-medium pr-3">
                  Paid
                </label>
              </div>
              <div className="flex items-center gap-2 w-[220px]">
                <Input
                  name="paid"
                  id="paid"
                  placeholder="All"
                  value=""
                  onChange={(e) => {
                    if (e.type) {
                      // dispatch(onOpenModal());
                    }
                    // setSearchTerm(e.target.value);
                  }}
                />
                <span
                  // onClick={() => dispatch(onOpenModal())}
                  className="cursor-pointer"
                >
                  <FaList size={20} />
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center ">
                <div className="w-28 block text-right">
                  <label htmlFor="customers" className="text-right pr-3 text-xs font-medium">
                    Customers
                  </label>
                </div>
                <div className="w-[220px] flex items-center gap-2">
                  <Input
                    name="customers"
                    id="customers"
                    value=""
                    onChange={(e) => {
                      if (e.type) {
                        // dispatch(onOpenModal());
                      }
                      // setSearchTerm(e.target.value);
                    }}
                  />
                  <span
                    // onClick={() => dispatch(onOpenModal())}
                    className="cursor-pointer"
                  >
                    <FaList size={20} />
                  </span>
                </div>
              </div>
              <div className="flex items-center ">
                <div className="w-28 block text-right">
                  <label htmlFor="product" className=" text-xs pr-3 font-medium">
                    Product
                  </label>
                </div>
                <div className="flex items-center gap-2 w-[220px]">
                  <Input
                    name="product"
                    id="product"
                    value=""
                    onChange={(e) => {
                      if (e.type) {
                        // dispatch(onOpenModal());
                      }
                      // setSearchTerm(e.target.value);
                    }}
                  />
                  <span
                    // onClick={() => dispatch(onOpenModal())}
                    className="cursor-pointer"
                  >
                    <FaList size={20} />
                  </span>
                </div>
              </div>
              <div className="flex items-center ">
                <div className="w-28 block text-right">
                  <label htmlFor="paymentmethod" className="pr-3 text-xs font-medium">
                    Payment Method
                  </label>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {[].map((item, index) => {
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

              <div className="flex items-center">
                <div className="w-28 block text-right">
                  <label htmlFor="insuranceCompany" className="text-xs font-medium pr-3">
                    Insurance Co.
                  </label>
                </div>
                <div>
                  <Select name="insuranceCompany">
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent id="insuranceCompany">
                      {[].map((item, index) => {
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
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center ">
              <div className="w-28 block text-right">
                <label htmlFor="date" className="text-right pr-3 text-xs font-medium">
                  Select Date
                </label>
              </div>
              <div className="w-[220px]">
                <DateSelect />
              </div>
            </div>
            <div className="flex items-center ">
              <div className="w-28 block text-right">
                <label className="pr-3 text-xs font-medium">Credit Note</label>
              </div>
              <div className="h-8 w-16 flex items-center">
                {['All', 'Only'].map((btn, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveCreditNoteBtn(btn)}
                      className={`py-2 px-4 border text-xs ${activeCreditNoteBtn === btn ? 'bg-primary text-white  hover:bg-primary-dark' : ''}`}
                    >
                      {btn}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center w-full mt-4'>
          <button className="bg-primary text-white px-6 py-2 text-xs shadow-lg rounded hover:bg-primary-dark">Search</button>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Transactions;
