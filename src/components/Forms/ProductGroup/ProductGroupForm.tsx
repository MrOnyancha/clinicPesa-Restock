import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ProductGroupForm: React.FC = () => {
  return (
    <form className="p-4 w-[650px]">
      <div className="flex gap-2 items-center mb-1">
        <div className="w-28 block text-right">
          <label className="text-xs ">
            <span className="text-red-500">*</span>Short Name
          </label>
        </div>
        <div className="w-5/6">
          <Input className="h-6 w-full bg-slate-100 rounded-sm " />
        </div>
      </div>

      <div className="flex gap-2 items-center mb-1">
        <div className="w-28 block text-right">
          <label className="text-xs ">
            <span className="text-red-500">*</span>Name
          </label>
        </div>
        <div className="w-2/3">
          <Input className="h-6 w-full bg-slate-100 rounded-sm " />
        </div>
      </div>

      <div className="flex gap-2 items-start mb-2 mt-2">
        <div className="w-28 block text-right">
          <label className="text-xs ">Address</label>
        </div>
        <div className="w-5/6">
          <Textarea />
        </div>
      </div>

      <hr />
      <div className="w-full flex items-center justify-between mt-4">
        <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
          Cancel
        </button>

        <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
      </div>
    </form>
  );
};

export default ProductGroupForm;
