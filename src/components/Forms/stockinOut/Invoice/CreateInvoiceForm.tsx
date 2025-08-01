import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import SearchableDropdown from '@/components/SearchableDropdown/SearchableDropdown';
import DateSelect from '@/components/DateSelect/DateSelect';
import { animalsList1 } from '@/utils/constants';

const CreateInvoiceForm: React.FC = () => {
  return (
    <form className="p-2 w-[600px]">
      <div className="flex gap-2 items-center mb-1">
        <div className="w-20 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Vendor
          </label>
        </div>
        <div >
          <SearchableDropdown options={animalsList1} id="" />
        </div>
      </div>
      <div className="flex gap-2 items-center mb-1">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-20 block text-right">
            <label className="text-xs text-right">Credit Limit</label>
          </div>
          <div>
            <Input className=" w-full bg-slate-100" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Currency</span>
          <Select>
            <SelectTrigger className="w-[184px]">
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
          <div className="w-2/3">
            <Input className=" w-full bg-slate-100 " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-20 block text-right">
            <label className="text-xs text-right">Date of issue</label>
          </div>
          <div>
            <DateSelect />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right text-nowrap">Acceptance Date</label>
          </div>
          <div className="w-full">
            <DateSelect />
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start mb-2 mt-2">
        <div className="w-20 block text-right">
          <label className="text-xs text-right">Comments</label>
        </div>
        <div className="w-5/6">
          <Textarea />
        </div>
      </div>
      <div className="flex gap-2 items-center mb-1">
        <div className="w-20 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Invoice Value
          </label>
        </div>
        <div className="w-1/3">
          <Input className=" w-full bg-slate-100" />
        </div>
      </div>
      <hr />
      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button className="btn-cancel">Cancel</button>

          <button className="btn-primary">Quick Fix</button>
        </div>
        <button className=" btn-primary">Create</button>
      </div>
    </form>
  );
};

export default CreateInvoiceForm;
