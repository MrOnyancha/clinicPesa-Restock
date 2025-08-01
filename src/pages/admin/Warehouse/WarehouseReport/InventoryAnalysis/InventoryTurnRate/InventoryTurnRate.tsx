import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const InventoryTurnRate: React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <p className="text-sm font-medium py-2">
          Day: <span>0</span>
        </p>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Inventory Beginning</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
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
          <div className="mb-1">
            <span className="text-xs">Inventory Ending</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
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
        <div className="flex justify-end mt-4">
          <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Return
          </button>
        </div>
      </aside>
      <div className="flex-1 shadow-md rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Puchase History</h4>
        </div>
      </div>
    </section>
  );
};

export default InventoryTurnRate;
