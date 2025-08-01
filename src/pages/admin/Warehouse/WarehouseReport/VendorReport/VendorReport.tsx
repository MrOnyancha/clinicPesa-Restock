import DateSelect from '@/components/DateSelect/DateSelect';
import React from 'react'
import { AiOutlineExpandAlt } from 'react-icons/ai';

const VendorReport:React.FC = () => {
  return (
    <section className="shadow border border-slate-200 flex">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className=" mt-2">
            <span className="text-xs my-3">Date of issue</span>
            <DateSelect />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Return</button>
        </div>
      </aside>
      <div className="flex-1 h-fit shadow-md rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Vendor Reports</h4>
          <button
            type="button"
            className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
          >
            <span>
              <AiOutlineExpandAlt size={20} />
            </span>
          </button>
        </div>
        <div className="p-4">No data found</div>
      </div>
    </section>
  );
}

export default VendorReport