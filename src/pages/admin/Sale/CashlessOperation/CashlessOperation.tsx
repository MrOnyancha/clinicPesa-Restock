import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';

const CashlessOperation: React.FC = () => {
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
          <div>
            <span className="text-xs">Choose Date</span>
            <DateSelect />
          </div>

          <button className="flex items-center justify-center mt-4 bg-primary  text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Return
          </button>
        </div>
      </aside>
      <div className=" m-2 rounded border w-full">
        <h4 className="font-medium p-2">Operations</h4>
        <hr />
      </div>
    </section>
  );
};

export default CashlessOperation;
