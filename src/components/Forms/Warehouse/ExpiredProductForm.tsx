import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DateSelect from '@/components/DateSelect/DateSelect';
import { BsFiletypePdf } from 'react-icons/bs';

const ExpiredProductForm: React.FC = () => {
  return (
    <form className="p-4 w-[650px]">
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-20 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span>
              Expired No.
            </label>
          </div>
          <div className="w-2/3">
            <Input className=" w-full bg-slate-100 " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-6">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-20 block text-right">
            <label className="text-xs text-right">Date </label>
          </div>
          <div>
            <DateSelect asSingle useRange={false} />
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

      <hr />
      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
            Cancel
          </button>
          <button className="border rounded bg-slate-100 text-xs cursor-pointer text-text-color px-2 py-2 hover:bg-slate-200">
            Download
          </button>
          <button className=" bg-primary flex items-center gap-2 text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Picking List
            <span>
              <BsFiletypePdf size={18} />
            </span>
          </button>
        </div>
        <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
      </div>
    </form>
  );
};

export default ExpiredProductForm;
