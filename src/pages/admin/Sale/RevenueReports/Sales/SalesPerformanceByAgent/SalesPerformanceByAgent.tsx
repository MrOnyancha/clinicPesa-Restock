import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS, salesAgentTableRows } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';

const SalesPerformanceByAgent: React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Options</h4>
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
          <div>
            <span className="text-xs">Choose Date</span>
            <DateSelect />
          </div>
        </div>
        <div className="flex mt-3 justify-end">
          <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Refresh
          </button>
        </div>
      </aside>
      <div className="border flex-1 pb-4 h-fit m-2 rounded">
        <div className="flex p-2  items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={[]} />
            <Actions data={[]} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {salesAgentTableRows.map((item, index) => {
                    return (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue className="text-xs" placeholder="select" />
                </SelectTrigger>
                <SelectContent defaultValue="Primary Report">
                  <SelectItem value="Primary Report">Primary Report</SelectItem>
                  <SelectItem value="Other Pharmacies">Other Pharmacies</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <hr />
        No data yet
      </div>
    </section>
  );
};

export default SalesPerformanceByAgent;
