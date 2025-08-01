import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';

const SalesABCAnalysis: React.FC = () => {
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
          <div className="mb-1">
            <span className="text-xs">Credit Note</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select credit note" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="correction">correction</SelectItem>
                <SelectItem value="sales">sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-xs">Choose Date</span>
            <DateSelect />
          </div>
          <div className="mb-1">
            <span className="text-xs">Group</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="a">A</SelectItem>
                <SelectItem value="b">B</SelectItem>
                <SelectItem value="c">C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <button className="flex items-center justify-center mt-4 bg-primary  text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Refresh
          </button>
        </div>
      </aside>
      <div className=" m-2 rounded border w-full">
        <div className="w-full bg-primary-dark  px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="text-white font-medium">Sales ABC Analysis</h4>
          <button
            type="button"
            className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
          >
            Summary
          </button>
        </div>
      </div>
    </section>
  );
};

export default SalesABCAnalysis;
