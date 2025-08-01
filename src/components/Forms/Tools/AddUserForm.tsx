import React, { useState } from 'react';
import TextDataControls from '@/components/Text-data-controls/TextDataControls';
import { Input } from '@/components/ui/input';
import { usersADS } from '@/utils/constants';

const AddUserForm: React.FC = () => {
  const [activeUserBtn, setActiveUserBtn] = useState<string>('No');

  return (
    <form className="p-4 w-[700px]">
      <div className="w-full flex items-center gap-8">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Username
            </label>
          </div>
          <div className="w-[200px]">
            <Input className="w-full bg-slate-100" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs">Active</label>
          <div className="h-6 border rounded-sm flex items-center">
            {['Yes', 'No'].map((text, idx) => {
              return (
                <button
                  onClick={() => setActiveUserBtn(text)}
                  type="button"
                  key={idx}
                  className={`px-2 h-full text-xs ${text === 'Yes' ? 'border-r' : ''} ${activeUserBtn === text ? 'bg-primary text-white' : ''}`}
                >
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center mb-1 mt-1">
        <div className="w-24 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Full name
          </label>
        </div>
        <div className="w-5/6">
          <Input className=" w-full bg-slate-100 " />
        </div>
      </div>
      <div className="flex gap-2 items-center mb-1 mt-6">
        <div className="w-24 block text-right">
          <label className="text-xs text-right">
            <span className="text-red-500">*</span> Address
          </label>
        </div>
        <div className="w-5/6">
          <Input className="w-full bg-slate-100" />
        </div>
      </div>
      <div className="w-full flex items-center justify-between mt-2">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Email</label>
          </div>
          <div>
            <Input className="w-full bg-slate-100" />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Phone</label>
          </div>
          <div className="w-5/6">
            <Input className="w-full bg-slate-100" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start mb-3 mt-1">
        <div className="w-24 block text-right">
          <label className="text-xs text-right">Branches</label>
        </div>
        <div className="w-5/6">
          <TextDataControls textData={usersADS} defaultText="" />
        </div>
      </div>
      <hr />
      <div className="w-full flex items-center justify-between my-3">
        <button type='button' className="btn-cancel">
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button type='button' className="btn-outline">
            Change History
          </button>
          <button type='button' className="btn-outline">
            Change Permissions
          </button>
        
        </div>
        <button type='button' className="btn-primary">Create</button>
      </div>
    </form>
  );
};

export default AddUserForm;
