import DateSelect from '@/components/DateSelect/DateSelect';
import React from 'react';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const ProfitabilitySummary: React.FC = () => {
  return (
    <section className="m-4 shadow min-h-screen border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className=" font-medium">Summary - General Performance</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            type="button"
            className="bg-primary text-xs text-white px-3 py-2 shadow-lg rounded transition-all duration-300 hover:bg-primary-dark"
          >
            <span className="block size-full">Print</span>
          </button>
          <button
            type="button"
            className="text-text-color cursor-pointer px-2 py-1.5 text-xs shadow-lg rounded bg-slate-100 border transition-all duration-300 hover:bg-slate-200"
          >
            <span>
              <AiOutlineExpandAlt size={20} />
            </span>
          </button>
        </div>
      </div>
      <hr />
      <div className="border p-2 h-auto m-2 rounded flex items-center justify-evenly">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium">Date of issue:</span>
          <DateSelect />
        </div>
      <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Return</button>
      </div>
      <div className='w-full p-4'>No data found</div>
    </section>
  );
};

export default ProfitabilitySummary;
