import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const BranchSalesSummary: React.FC = () => {
  return (
    <section className="flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div>
          <span className="text-xs">Choose Date</span>
          <DateSelect />
        </div>
        <button className="flex items-center justify-center mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
          Report
        </button>
      </aside>
      <div className="flex-1 shadow-md rounded m-2 border">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Puchase History</h4>
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
};

export default BranchSalesSummary;
