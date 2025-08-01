import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import { FiRefreshCw } from 'react-icons/fi';

const AgingReceivables: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Chart');

  return (
    <section className="m-4 shadow flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="text-sm font-medium text-left">Customers</h4>
          <div className="flex gap-2 items-center">
            <button className=" bg-primary text-white text-xs rounded py-2 px-4 hover:bg-primary-dark">All</button>
            <button className=" bg-white text-primary text-xs rounded border border-primary py-2 px-2 hover:bg-primary-dark hover:text-white transition-all duration-300">
              None
            </button>
          </div>
        </div>
        <div className="mb-1">
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
        </div>
        <div className="flex justify-end mt-4 w-full">
          <button className=" bg-primary w-full flex items-center justify-center text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Refresh{' '}
            <span className="ml-2">
              <FiRefreshCw size={20} />
            </span>
          </button>
        </div>
      </aside>
      <div className="m-2 p-2 border rounded w-full">
        <div className="p-2 w-full flex items-center gap-3 shadow rounded">
          {['Chart', 'Table'].map((txt, idx) => {
            return (
              <button
                onClick={() => setActiveTab(txt)}
                key={idx}
                className={`${activeTab === txt ? 'text-primary border-b-2 border-primary' : 'border-b-white'} px-2 block h-full border-b-2 transition-all duration-300 hover:border-b-2 hover:text-primary hover:border-primary`}
              >
                {txt}
              </button>
            );
          })}
        </div>
        <div className="p-2 shadow rounded mt-4">
          {activeTab==='Chart'&&<div>Chart</div>}
          {activeTab==='Table'&&<div>Table</div>}
        </div>
      </div>
    </section>
  );
};

export default AgingReceivables;
