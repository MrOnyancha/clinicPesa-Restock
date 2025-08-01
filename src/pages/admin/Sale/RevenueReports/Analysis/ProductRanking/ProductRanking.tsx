import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';

const ProductRanking: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  return (
    <section className="flex ">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Branch</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {puchaseHistoyADS.map((item, index) => {
                  return (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="pb-1">
            <span className="text-xs">Choose Date</span>
            <DateSelect />
          </div>
          <span className="mt-2 font-medium">Top</span>
          <hr />
          <div className="mt-4 mb-4">
            <RadioGroup>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="profit" id="profit" />
                <label htmlFor="profit" className="text-xs">
                  Profit
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="Quantity" id="quantity" />
                <label htmlFor="quantity" className="text-xs">
                  Quantity
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="QuantityPack" id="quantityPack" />
                <label htmlFor="quantityPack" className="text-xs">
                  Quantity (Pack)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="Selling Value" id="sellingValue" />
                <label htmlFor="sellingValue" className="text-xs">
                  Selling Value
                </label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <div className="flex items-center w-full gap-1">
              {[10, 50, 100, 200, 500, 1000, 1500, 2000].map((value, idx) => {
                return (
                  <span
                    onClick={() => setInputValue(String(value))}
                    className="text-xs text-primary hover:underline cursor-pointer"
                    key={idx}
                  >
                    {value}
                  </span>
                );
              })}
            </div>
          </div>
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
          <button className="flex items-center justify-center mt-4 bg-primary  text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Report
          </button>
        </div>
      </aside>
      <div className=" m-2 rounded border w-full">
        <div className="w-full bg-primary-dark  px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="text-white font-medium">Product ranking (Top 100)</h4>
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

export default ProductRanking;
