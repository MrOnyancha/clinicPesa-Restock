import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react'

const SalesAgentForm:React.FC = () => {
  return (
    <form className="p-4 w-[650px]">
      <div className="flex gap-2 items-center mb-1">
        <div className="w-16 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Short
          </label>
        </div>
        <div className="">
          <Input className="h-6 w-full bg-slate-100 rounded-sm " />
        </div>
      </div>
      <div className="flex gap-2 items-center mb-1">
        <div className="w-16 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Name
          </label>
        </div>
        <div>
          <Input className="h-6 w-full bg-slate-100 rounded-sm " />
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-16 block text-right">
            <label className="text-xs text-right">Phone</label>
          </div>
          <div className="w-2/3">
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
        <div className="flex gap-2 items-center mb-1">
          <div className="w-16 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Percent
            </label>
          </div>
          <div className="w-1/3">
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start mb-2 mt-2">
        <div className="w-16 block text-right">
          <label className="text-xs text-right">Comments</label>
        </div>
        <div className="w-5/6">
          <Textarea />
        </div>
      </div>
      <hr/>
      <div className="w-full flex items-center justify-between mt-4">
        <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button className="border rounded bg-slate-100 text-xs cursor-pointer text-text-color px-2 py-2 hover:bg-slate-200">
            Change History
          </button>
          <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
        </div>
      </div>
    </form>
  );
}

export default SalesAgentForm