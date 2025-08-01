import { InnerModal } from '@/components/Modal/Modal';
import { onOpenInnerModal } from '@/components/Modal/innerModalSlice';
import { Input } from '@/components/ui/input';
import { useInnerModalDispatch, useInnerModalSelector } from '@/store/hooks';
import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateSelect from '@/components/DateSelect/DateSelect';
import SearchProductForm from './SearchProductForm';

const InvoiceDetailsForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const dispatch = useInnerModalDispatch();
  const showInnerModal = useInnerModalSelector((state) => state.innerModal.isOpen);

  return (
    <React.Fragment>
      <form className="py-4 pr-4 w-[650px]">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-32 block text-right">
            <label className="text-xs text-right">Product</label>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Input
              name="vendors"
              id="vendors"
              placeholder="All"
              value={searchTerm}
              onChange={(e) => {
                if (e.type) {
                  dispatch(onOpenInnerModal());
                }
                setSearchTerm(e.target.value);
              }}
            />
            <span onClick={() => dispatch(onOpenInnerModal())} className="cursor-pointer">
              <FaList size={20} />
            </span>
          </div>
        </div>
        <div className="flex items-center ">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-32 block text-right">
              <label className="text-xs text-right">No. of Packs</label>
            </div>
            <div className="w-1/3">
              <Input type="number" className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex-1 flex w-full items-center">
            <div className="flex gap-2 items-center mb-1">
              <div className="w-16 block text-right">
                <label className="text-xs text-right">Unit</label>
              </div>
              <div className="w-1/3">
                <Input type="number" className="h-6 w-full bg-slate-100 rounded-sm " />
              </div>
            </div>
            <div className="flex gap-2 items-center mb-1">
              <div className="w-16 block text-right">
                <label className="text-xs text-right">Pack size</label>
              </div>
              <div className="w-1/3">
                <Input type="number" className="h-6 w-full bg-slate-100 rounded-sm " />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-32 block text-right">
              <label className="text-xs text-right">Net Cost Price (Pack)</label>
            </div>
            <div className="w-1/2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <label className="text-xs text-right">Net Cost Price (Unit)</label>
            <div className="w-1/2">
              <Input className="h-6  bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-4">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-32 block text-right">
              <label className="text-xs text-right">Gross Cost Price (Pack)</label>
            </div>
            <div className="w-1/2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">VAT(%)</span>
            <Select>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent defaultValue={0}>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="18">18</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <label className="text-xs text-right">Gross </label>
            <div className="w-2/3">
              <Input className="h-6  bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-32 block text-right">
              <label className="text-xs text-right">Expiry Date</label>
            </div>
            <div className="">
              <DateSelect asSingle useRange={false} />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <label className="text-xs text-right">Serial No</label>
            <div className="w-2/3">
              <Input className="h-6  bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 justify-center">
          <div className="flex gap-2 items-center mb-1 ">
            <span className="text-xs text-right">Net Value:</span>
            <span className="font-bold">5900</span>
          </div>

          <div className="flex gap-2 items-center mb-1 px-10">
            <span className="text-xs text-right">VAT Value:</span>
            <span className="font-bold">0</span>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <span className="text-xs text-right">Gross Value (VAT Incl):</span>
            <span className="font-bold">5900</span>
          </div>
        </div>
        <div className="flex items-center mt-4 justify-center">
          <div className="flex gap-2 items-center mb-1 pr-8">
            <span className="text-xs text-right">Previous Date:</span>
            <span className="font-bold">2024-03-20</span>
          </div>

          <div className="flex gap-2 items-center mb-1">
            <span className="text-xs text-right">Exchange rate:</span>
            <span className="font-bold">1</span>
          </div>
        </div>
        <div className="flex items-center mt-4 justify-center">
          <div className="flex gap-2 items-center mb-1 pr-8">
            <span className="text-xs text-right">Previous Price:</span>
            <span className="font-bold">5656</span>
          </div>

          <div className="flex gap-2 items-center mb-1">
            <span className="text-xs text-right">Currency:</span>
            <span className="font-bold">UGX</span>
          </div>
        </div>
        <hr />
        <button className="w-full bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Save</button>
      </form>
      {showInnerModal && <InnerModal title="Products">
        <SearchProductForm/>
        </InnerModal>}
    </React.Fragment>
  );
};

export default InvoiceDetailsForm;
