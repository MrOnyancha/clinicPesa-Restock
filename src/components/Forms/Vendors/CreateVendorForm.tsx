import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FaPlus } from 'react-icons/fa';
import { useInnerModalDispatch, useInnerModalSelector, } from '@/store/hooks';
import { InnerModal } from '@/components/Modal/Modal';
import { onOpenInnerModal } from '@/components/Modal/innerModalSlice';
import BankAccountDetailsForm from './BankAccountDetailsForm';

const CreateVendorForm: React.FC = () => {
  const [activeText, setActiveText] = useState<string>('Info');

  const showModal = useInnerModalSelector((state) => state.innerModal.isOpen);
  const dispatch = useInnerModalDispatch();

  return (
    <React.Fragment>
      <form className="p-4 w-[720px]">
        <div>
          {['Info', 'Bank Account'].map((text, idx) => {
            return (
              <button
                type="button"
                onClick={() => setActiveText(text)}
                className={`py-3 p-2 border-b-white text-xs mx-1 border-b-2 hover:bg-slate-100 ${activeText === text ? 'border-b-2 bg-slate-100 border-b-primary font-medium ' : ''}`}
                key={idx}
              >
                {text}
              </button>
            );
          })}
        </div>
        {activeText === 'Info' ? (
          <div>
            <div className="w-full flex items-center gap-3">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">
                    <span className="text-red-500">*</span> Products
                  </label>
                </div>
                <div className="">
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-right">Currency</span>
                <Select>
                  <SelectTrigger className="w-full">
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
            <div className="w-full mt-1">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">Address</label>
                </div>
                <div className="w-5/6">
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
            </div>
            <div className=" flex items-center justify-between">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">P.O.Box</label>
                </div>
                <div>
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="text-right">
                  <label className="text-xs text-right">TIN</label>
                </div>
                <div className="w-32">
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="text-right">
                  <label className="text-xs text-right">Country</label>
                </div>
                <div className="W-2/3">
                  <Select>
                    <SelectTrigger className="W-full">
                      <SelectValue placeholder="Select country" />
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
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">Phone</label>
                </div>
                <div>
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">Mail</label>
                </div>
                <div>
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">Payment Term (Days)</label>
                </div>
                <div>
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="w-24 block text-right">
                  <label className="text-xs text-right">Credit Limit</label>
                </div>
                <div>
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-2 items-center mb-1">
                <div className="w-28 block text-right">
                  <label className="text-xs text-right">Lead time (order)</label>
                </div>
                <div className="w-1/3">
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex gap-2 items-center mb-1">
                <div className="w-32 block text-right">
                  <label className="text-xs">Lead time (minimum)</label>
                </div>
                <div className="w-1/3">
                  <Input className="h-6 w-full bg-slate-100 rounded-sm " />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">WHT</span>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                  </SelectContent>
                </Select>
                %
              </div>
            </div>
            <div className="flex gap-2 items-start mb-1 mt-2">
              <div className="w-28 block text-right">
                <label className="text-xs text-right">Comments</label>
              </div>
              <div className="w-5/6">
                <Textarea />
              </div>
            </div>
            <div className="w-full flex items-center justify-between mt-4">
              <div className="flex gap-2 items-center">
                <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
                  Cancel
                </button>
                <button className="border rounded bg-slate-100 text-xs cursor-pointer text-text-color px-2 py-2 hover:bg-slate-200">
                  Change History
                </button>
                <button className="border rounded bg-slate-100 text-xs cursor-pointer text-text-color px-2 py-2 hover:bg-slate-200">
                  Detail
                </button>
              </div>
              <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-full flex items-center justify-end">
              <button
                type="button"
                onClick={() => dispatch(onOpenInnerModal())}
                className="border rounded p-2 text-white bg-primary hover:bg-primary-dark"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        )}
      </form>
      {showModal && <InnerModal title="Bank account details">
        <BankAccountDetailsForm/>
        </InnerModal>}
    </React.Fragment>
  );
};

export default CreateVendorForm;
