import React from 'react'
import DateSelect from '@/components/DateSelect/DateSelect';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import CheckBoxes from '@/components/CheckBoxesGroup/CheckBoxes';


const SalesCategoryAnalysis:React.FC = () => {
  return (
    <section className="flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
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
        <h6 className="my-2 text-xs">Departments</h6>
        <CheckBoxes labels={['Analytics']} />
        <button className="flex items-center justify-center mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
          Report
        </button>
      </aside>
      <div className="flex-1 shadow-md rounded m-2 border">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Sales Category Analysis</h4>
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
}

export default SalesCategoryAnalysis