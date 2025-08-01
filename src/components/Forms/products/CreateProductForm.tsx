import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { units } from '@/utils/constants';
import { Textarea } from '@/components/ui/textarea';

const CreateProductForm = () => {
  const [activeAutoOrder, setActiveAutoOrder] = useState<string>('None');
  const [activeMarkup, setActiveMarkup] = useState<string>('Stable markup');

  return (
    <form className="p-4 w-[720px]">
      <div className="w-full flex items-center gap-3">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">
              <span className="text-red-500">*</span> Products
            </label>
          </div>
          <div className="w-[400px]">
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs">SAH:</label>
          <Input className="h-6 bg-slate-100 rounded-sm" />
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Last Name</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-right">Type</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Strength</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="package">
            <span className="text-red-500">*</span>
            <span className="text-xs text-right">Package</span>
          </label>
          <div className="w-20">
            <Input id="package" name="package" className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-right">Unit</span>
          <div className="w-full">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((item, index) => {
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
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Country</label>
          </div>
          <div className="">
            <Select>
              <SelectTrigger className="w-full">
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
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Catalogue</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Culture</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">HS Code</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">CAS Number</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Manufacturer</label>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[250px]">
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
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Class</label>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[200px]">
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
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Bar code</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-28 block text-right">
            <label className="text-xs text-right">Expected expiry day</label>
          </div>
          <div>
            <Input type="number" className="h-6 w-24 bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Vendor</label>
          </div>
          <div className="">
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select vendor" />
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
        <div className="flex items-center gap-3">
          <span className="text-xs text-right">Auto Order</span>
          <div className="flex items-center border rounded bg-slate-100">
            {['None', 'Not seasonal', 'Seasonal'].map((btn, idx) => {
              return (
                <button
                  type="button"
                  onClick={() => setActiveAutoOrder(btn)}
                  className={`text-xs px-2 py-1 hover:bg-primary hover:text-white transition-all duration-300 ${btn === 'Not seasonal' ? 'border-x' : ''} ${activeAutoOrder === btn ? 'bg-primary text-white' : ''}`}
                  key={idx}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block " />
          <div className="flex items-center border rounded bg-slate-100">
            {['Stable markup', 'Stable Price'].map((btn, idx) => {
              return (
                <button
                  type="button"
                  onClick={() => setActiveMarkup(btn)}
                  className={`text-xs px-2 py-1 hover:bg-primary hover:text-white transition-all duration-300 ${btn === 'Stable markup' ? 'border-r' : ''} ${activeMarkup === btn ? 'bg-primary text-white' : ''}`}
                  key={idx}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Tax</label>
          </div>
          <div>
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select tax" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-4">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Retail Price</label>
          </div>
          <div>
            <Input className="h-6 w-full bg-slate-100 rounded-sm " />
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex gap-2 items-center mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right flex flex-col">
              <span>Psychotropic</span> <span>substances</span>
            </label>
          </div>
          <div className="flex-1">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="1-n">I-N</SelectItem>
                <SelectItem value="2-n">II-N</SelectItem>
                <SelectItem value="3-n">III-N</SelectItem>
                <SelectItem value="4-nv">IV-N</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="w-full ">
        <div className="flex gap-2 items-start mb-1">
          <div className="w-24 block text-right">
            <label className="text-xs text-right">Comments</label>
          </div>
          <div className="flex-1">
            <Textarea className="w-full" />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-around">
        <div className="mb-1">
          <span className="text-xs">Department</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Pharma</SelectItem>
              <SelectItem value="2">OTC</SelectItem>
              <SelectItem value="3">Personal care(Beauty)</SelectItem>
              <SelectItem value="4">Mother and Baby</SelectItem>
              <SelectItem value="5">Sports & weights managemnt</SelectItem>
              <SelectItem value="6">Cosmetics</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-1">
          <span className="text-xs">Category</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t1">Test 1</SelectItem>
              <SelectItem value="t2">Test2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-1">
          <span className="text-xs">Condition</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select condtion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="t3">test3</SelectItem>
              <SelectItem value="t4">test4</SelectItem>
              <SelectItem value="t5">test5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full text-xs">
        <div className="flex gap-40 items-center mb-1 ">
          <div className="w-24 block text-right">
            <p>Last Invoice:</p>
          </div>
          <p>Vendor:</p>
        </div>
      </div>
      <div className="w-full text-xs">
        <div className=" mb-1 ">
          <div className="w-24 block text-right">
            <p>Price:</p>
          </div>
        </div>
      </div>
      <hr />
      <div className="w-full flex items-center justify-between my-3">
        <button type="button" className="btn-cancel">
          Cancel
        </button>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-outline">
            Change History
          </button>
          <button type="button" className="btn-outline">
            Change Price
          </button>
          <button type="button" className="btn-outline">
            Detail
          </button>
        </div>
        <button type="button" className="btn-primary">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateProductForm;
