import React from 'react';
import Actions from '@/components/Actions/Actions';
import DateSelect from '@/components/DateSelect/DateSelect';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { medicineRefundedActions, searchMedicinesRefundedTableConditions } from '@/utils/constants';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const MedicinesRefunded: React.FC = () => {
  return (
    <section className="m-2">
      <div className="w-full flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="pl-4 pr-2 text-xs">From:</span>
          <DateSelect />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="pl-4 pr-2 text-xs">From:</span>

            <DateSelect />
          </div>
          <button type="button" className="btn-primary">
            Show
          </button>
        </div>
      </div>
      <div className="border rounded p-2 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchMedicinesRefundedTableConditions} />
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
};

export default MedicinesRefunded;
