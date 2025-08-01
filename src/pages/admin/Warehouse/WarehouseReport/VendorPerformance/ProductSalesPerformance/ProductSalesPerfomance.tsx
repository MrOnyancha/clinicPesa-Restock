import React, { useState } from 'react';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import DateSelect from '@/components/DateSelect/DateSelect';

const ProductSalesPerfomance: React.FC = () => {
  const [showCheckboxes, setShowCheckBoxes] = useState<boolean>(false);

  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Vendor</span>
            <Select>
              <SelectTrigger className="w-full">
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
          <div className="mt-2 ">
            <RadioGroup className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => setShowCheckBoxes(false)} value="Puchase" id="purchase" />
                <label htmlFor="purchase" className="text-xs">
                  Purchase
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => setShowCheckBoxes(true)} value="Sale" id="sale" />
                <label htmlFor="sale" className="text-xs">
                  Sale
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className=" mt-2 ">
          <span className="text-xs my-3">Date range</span>
          <DateSelect />
        </div>
        {showCheckboxes && (
          <div className="flex gap-4 mt-3">
            <label key="" htmlFor="" className="flex items-center gap-1">
              <input
                type="checkbox"
                value="pack"
                id="pack"
                name="pack"
                onChange={() => {}}
                className="w-4 h-4 text-text-color bg-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className={`text-xs`}>Pack</span>
            </label>
            <label key="" htmlFor="" className="flex items-center gap-1">
              <input
                type="checkbox"
                value="unit"
                id="unit"
                name="unit"
                onChange={() => {}}
                className="w-4 h-4 text-text-color bg-primary border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className={`text-xs`}>Unit</span>
            </label>
          </div>
        )}
        <div className="flex justify-end mt-3">
          <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Return
          </button>
        </div>
      </aside>
      <div className="flex-1 shadow-md rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Product Sales Performace</h4>
          <button
            type="button"
            className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
          >
            <span>
              <AiOutlineExpandAlt size={20} />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSalesPerfomance;
