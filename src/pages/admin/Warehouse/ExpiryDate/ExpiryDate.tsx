import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  expiryDateActions,
  productsPurchasedRows,
  puchaseHistoyADS,
  searchExpiryDateContions,
} from '@/utils/constants';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';

const ExpiryDate: React.FC = () => {
  return (
    <section className="m-4 shadow flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Expiry Date</h4>
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
          <div className="ml-4 mt-3">
            <span>Options</span>
            <div className="mb-1">
              <span className="text-xs">Date</span>
              <DateSelect />
            </div>
            <button className="mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Show
            </button>
          </div>
        </div>
      </aside>
      <div className=" p-2 border rounded w-full m-2">
        <div className="flex relative items-center gap-3">
          <SearchGroup data={searchExpiryDateContions} />
          <Actions data={expiryDateActions} />
          <div className="flex items-center gap-1">
            <span className="text-xs">Rows:</span>
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue className="text-xs" placeholder="select rows" />
              </SelectTrigger>
              <SelectContent>
                {productsPurchasedRows.map((item, index) => {
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
      </div>
    </section>
  );
};

export default ExpiryDate;
