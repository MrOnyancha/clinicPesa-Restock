import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productAuditActions, productsPurchasedRows, puchaseHistoyADS } from '@/utils/constants';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';

const ArAgingReport: React.FC = () => {
  return (
    <section className="m-4 shadow flex border border-slate-200">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Options</h4>
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
        </div>
      </aside>
      <div className=" p-2 border rounded w-full m-2">
        <div className="flex relative items-center gap-3">
          <SearchGroup data={['All Columns', 'Customer', 'Address', 'Phone', 'Mail', 'Outstanding Payment']} />
          <Actions data={productAuditActions} />
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

export default ArAgingReport;
