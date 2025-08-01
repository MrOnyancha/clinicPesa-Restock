import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BankAccountDetailsForm: React.FC = () => {
  return (
    <form className="p-4 w-[720px]">
      <div>
        <div className="w-full flex items-center gap-3">
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Bank</label>
            </div>
            <div className="W-2/3">
              <Select>
                <SelectTrigger className="W-full">
                  <SelectValue placeholder="Select bank" />
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
          <div className="flex gap-2 items-center mb-1">
            <div className="text-right">
              <label className="text-xs text-right">Sort</label>
            </div>
            <div className="w-32">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="flex gap-2 items-center my-1">
          <div className="w-28 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Number
            </label>
          </div>
          <div className="">
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center my-1">
          <div className="w-28 block text-right">
            <label className="text-xs text-right">Comments</label>
          </div>
          <div className="w-5/6">
            <Textarea />
          </div>
        </div>
        <div className="flex items-center  my-1">
          <div className="w-28 block text-right">
            <label className="text-xs text-right">User Create:</label>
          </div>
          <span className="font-medium pl-2">Businge Bisanga</span>

          <div className="flex gap-2 items-center pl-10">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Creation time:
            </label>
            <span className="font-medium ">2024-03-25</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="flex my-3 items-center justify-between">
        <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
          Cancel
        </button>
        <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
      </div>
    </form>
  );
};

export default BankAccountDetailsForm;
