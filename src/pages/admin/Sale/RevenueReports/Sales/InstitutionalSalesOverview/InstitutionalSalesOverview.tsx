import React from 'react'
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';


const InstitutionalSalesOverview:React.FC = () => {
  return (
    <section className="shadow flex border border-slate-200">
      <aside className="w-[250px] min-h-screen overflow-y-auto border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
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
          <div className="flex justify-end mt-3">
            <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Report</button>
          </div>
        </div>
      </aside>
      <div className="m-2 w-full border rounded">
        <div className="w-full bg-primary-dark  px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="text-white font-medium">Institutional Sales Overview</h4>
          <button
            type="button"
            className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
          >
            <span>
              <AiOutlineExpandAlt size={20} />
            </span>
          </button>
        </div>
        No data yet
      </div>
    </section>
  );
}

export default InstitutionalSalesOverview