import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const MonthlyRevenue: React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div>
            <span className="text-xs">Years</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue className="text-xs" placeholder="select years" />
              </SelectTrigger>
              <SelectContent>
                {['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].map((item, index) => {
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
        <div className="flex justify-end mt-3">
          <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Report
          </button>
        </div>
      </aside>
      <div className="flex-1 border rounded m-2">
        <div className="m-2 border rounded">
          <div className="w-full bg-primary-dark px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className="text-white font-medium">Monthly Revenue</h4>
            <button
              type="button"
              className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
            >
              <span>
                <AiOutlineExpandAlt size={20} />
              </span>
            </button>
          </div>
          <div className="h-[200px] w-full flex items-center justify-center">No data yet</div>
        </div>
        <div className="m-2 border rounded">
          <div className="w-full bg-primary-dark px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className="text-white font-medium">Monthly Gross Profit</h4>
            <button
              type="button"
              className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
            >
              <span>
                <AiOutlineExpandAlt size={20} />
              </span>
            </button>
          </div>
          <div className="h-[200px] w-full flex items-center justify-center">No data yet</div>
        </div>
        <div className="m-2 border rounded">
          <div className="w-full bg-primary-dark px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className="text-white font-medium">Monthly Gross Profit</h4>
            <button
              type="button"
              className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
            >
              <span>
                <AiOutlineExpandAlt size={20} />
              </span>
            </button>
          </div>
          <div className="h-[200px] w-full flex items-center justify-center">No data yet</div>
        </div>
      </div>
    </section>
  );
};

export default MonthlyRevenue;
