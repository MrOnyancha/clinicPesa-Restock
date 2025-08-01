import React from 'react'
import Actions from '@/components/Actions/Actions';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { medicineRefundedActions, searchChangesInPurchaseTableConditions } from '@/utils/constants';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const ChangesInPurchase:React.FC = () => {
  return (
    <section className="m-2">
      <div className="border rounded p-2 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchChangesInPurchaseTableConditions} />
            <Actions data={medicineRefundedActions} />
          </div>
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

export default ChangesInPurchase