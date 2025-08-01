import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MdHelpOutline } from 'react-icons/md';
import { useInnerModalDispatch, useInnerModalSelector } from '@/store/hooks';
import { InnerModal } from '@/components/Modal/Modal';
import { onOpenInnerModal } from '@/components/Modal/innerModalSlice';
import { Textarea } from '@/components/ui/textarea';

const InsuranceCompanyForm: React.FC = () => {
  const [activePriceChange, setActivePriceChange] = useState<string>('OFF');

  const showModal = useInnerModalSelector((state) => state.innerModal.isOpen);
  const dispatch = useInnerModalDispatch();

  return (
    <React.Fragment>
      <form className="p-4 w-[600px]">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-16 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Name
            </label>
          </div>
          <div className="flex-1">
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>

        <div className="w-full">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs ">Address</label>
            </div>
            <div className="flex-1">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">P.O.Box</label>
            </div>
            <div className="w-28">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="text-right">
              <label className="text-xs text-right">TIN</label>
            </div>
            <div className="w-28">
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
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Phone</label>
            </div>
            <div>
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Mail</label>
            </div>
            <div>
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-16 block" />
          <div className="w-full flex justify-between items-center">
            <div className="W-2/3">
              <span className="text-xs">Price List</span>
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
            <div className="w-32">
              <span className="text-xs">Margin</span>
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
            <div>
              <span className="text-xs">Price Change</span>
              <div className="border rounded bg-slate-100">
                {['ON', 'OFF'].map((text, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setActivePriceChange(text)}
                      type="button"
                      className={`px-2 hover:bg-slate-200 ${activePriceChange === text ? 'bg-primary text-white' : ''}`}
                    >
                      {text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-16 block" />
          <div>
            <p className="text-xs flex items-center gap-2 pt-2 pb-1">
              Coinsurance %
              <span className="block cursor-pointer" onClick={() => dispatch(onOpenInnerModal())}>
                <MdHelpOutline size={20} />
              </span>
            </p>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-start mb-1 mt-2">
          <div className="w-16 block text-right">
            <label className="text-xs text-right">Comments</label>
          </div>
          <div className="w-5/6">
            <Textarea />
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
            Cancel
          </button>
          <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
        </div>
      </form>
      {showModal && (
        <InnerModal title=" Coinsurance %">
          <p>
            Coinsurance is also a form of cost-sharing. <br /> It is a percentage of the insured's allowed amount for
            the service/product.
          </p>
        </InnerModal>
      )}
    </React.Fragment>
  );
};

export default InsuranceCompanyForm;
