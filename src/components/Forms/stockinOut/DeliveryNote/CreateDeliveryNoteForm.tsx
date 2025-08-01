import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SearchableDropdown from '@/components/SearchableDropdown/SearchableDropdown';
import DateSelect from '@/components/DateSelect/DateSelect';
import { BsFiletypePdf } from 'react-icons/bs';

const CreateDeliveryNoteForm: React.FC = () => {
  return (
    <form className="p-4 w-[650px]">
      <div className="flex gap-2 items-center mb-1">
        <div className="w-20 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Branch
          </label>
        </div>
        <div>
          <SearchableDropdown options={[]} id=""  />
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-20 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span>
              Delivery No.
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
            <label className="text-xs text-right">Date of issue</label>
          </div>
          <div>
            <DateSelect />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Acceptance Date</label>
          </div>
          <div>
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

      <div className="w-full flex items-center justify-between mt-4 border-t pt-2 dark:border-t dark:border-t-slate-600">
        <div className="flex items-center gap-2">
          <button className="btn-cancel">Cancel</button>
          <button className="btn-outline">Download</button>
          <button className="btn-primary flex items-center gap-2">
            Picking List
            <span>
              <BsFiletypePdf size={18} />
            </span>
          </button>
        </div>
        <button className="btn-primary">Create</button>
      </div>
    </form>
  );
};

export default CreateDeliveryNoteForm;
