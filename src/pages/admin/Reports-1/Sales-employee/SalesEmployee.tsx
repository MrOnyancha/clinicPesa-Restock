import React from 'react';
import Actions from '@/components/Actions/Actions';
import DateSelect from '@/components/DateSelect/DateSelect';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { SalesEmployeeActions, salesEmployeeOptions, searchSalesRevenueDrugsTable,  stockAtHandTableRows } from '@/utils/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SalesEmployee: React.FC = () => {
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
        <div className="flex relative items-center gap-3">
          <SearchGroup data={searchSalesRevenueDrugsTable} />
          <Actions data={SalesEmployeeActions} />
          <div className="flex items-center gap-1">
            <span className="text-xs">Rows:</span>
            <Select>
              <SelectTrigger className="w-[100px]">
                <SelectValue className="text-xs" placeholder="select rows" />
              </SelectTrigger>
              <SelectContent>
                {stockAtHandTableRows.map((item, index) => {
                  return (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue className="text-xs" placeholder="Primary Report" />
            </SelectTrigger>
            <SelectContent defaultValue="Primary Report">
              {salesEmployeeOptions.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <span className="font-bold text-sm pl-2">{item.name}</span>
                    {item.options.map((option, idx) => {
                      return (
                        <SelectItem value={option} key={idx}>
                          {idx + 1}.<span className="pl-1">{option}</span>
                        </SelectItem>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <hr />
      <div className="p-2"></div>
    </section>
  );
};

export default SalesEmployee;
