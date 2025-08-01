import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const MonthEndInventory:React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Year</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2-23">2-23</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Return
            </button>
          </div>
        </div>
      </aside>
      <div className="flex-1 shadow-md rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Montly warehouse</h4>
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

export default MonthEndInventory