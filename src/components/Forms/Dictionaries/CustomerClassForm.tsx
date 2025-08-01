import React from 'react';
import { Input } from '@/components/ui/input';

const CustomerClassForm: React.FC = () => {
  return (
    <form className="p-4 w-[600px]">
      <div className="flex gap-2 items-center mb-1">
        <div className="w-16 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Name
          </label>
        </div>
        <div className="w-full">
          <Input className="h-6 w-full bg-slate-100 rounded-sm " />
        </div>
      </div>
      <div className="w-full flex items-center justify-between mt-4 mb-2">
        <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
          Cancel
        </button>
        <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
      </div>
      <hr />
    </form>
  );
};

export default CustomerClassForm;
