import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const CreateCustomerForm: React.FC = () => {
  return (
    <form className="p-4 w-[720px] overflow-y-auto">
      <div className="w-full flex items-center gap-3 mb-1">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs text-right">Surname</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 block text-left">
            <span className="text-xs">Type</span>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[184px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospiatal</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs text-left">First name</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs text-right">Middle name</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs text-left">Sex</label>
          </div>
          <Select>
            <SelectTrigger className="w-[184px]">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs">Date of birth</label>
          </div>
          <div>
            <Input type="date" className="h-6 w-[184px] bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-3">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs ">Class</label>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[184px]">
                <SelectValue placeholder="Select class" />
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
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs ">Country</label>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[184px]">
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
      <div className="w-full flex items-center gap-3">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs ">National ID No. / Passport</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-left">
            <label className="text-xs">Date of Expiry</label>
          </div>
          <div>
            <Input type="date" className="h-6 w-[184px] bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center  justify-center">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-28 block text-right">
            <label className="text-xs text-right">Created at Branch:</label>
          </div>
          <span className="font-medium text-sm">clinicPesa</span>
        </div>
      </div>
      <hr />
      <section className="flex items-center gap-2 my-3">
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Address</h4>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Village of residency</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Town</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">District</label>
            </div>
            <div className="w-2/3 pr-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select district" />
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
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Contact Information</h4>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Mobile</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Email</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">P.O.Box</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-start gap-2 my-3">
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Data For The Insurer</h4>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Insurance</label>
            </div>
            <div className="w-2/3 pr-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select district" />
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
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">M-card</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Address</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Contact</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Comments</h4>
          <div className="px-2">
            <Textarea />
          </div>
        </div>
      </section>
      <section className="flex items-start gap-2 my-3">
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Sales Agent</h4>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Sales agent</label>
            </div>
            <div className="w-2/3 pr-2">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select district" />
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
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Mobile</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-28 block text-right">
              <label className="text-xs text-right">Mail</label>
            </div>
            <div className="w-2/3 pr-2">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
        <div className="w-full shadow-sm rounded border pb-2 min-h-[150px]">
          <h4 className="block px-4 py-2 mb-2 border-b font-medium bg-[#e3fafc]">Contact Personal</h4>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Name</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Mobile</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
          <div className="flex gap-2 items-center mb-1">
            <div className="w-16 block text-right">
              <label className="text-xs text-right">Email</label>
            </div>
            <div className="w-3/4">
              <Input className="h-6 w-full bg-slate-100 rounded-sm " />
            </div>
          </div>
        </div>
      </section>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-end gap-3">
          <button className="border border-red-700 rounded bg-transparent text-xs cursor-pointer text-red-700 px-2 py-2 hover:bg-red-50">
            Cancel
          </button>
          <button className="border rounded bg-slate-100 text-xs cursor-pointer text-text-color px-2 py-2 hover:bg-slate-200">
            Change History
          </button>
        </div>
        <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Create</button>
      </div>
    </form>
  );
};

export default CreateCustomerForm;
