import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  bufferReportADS,
  bufferReportActions,
  bufferReportTableSearchConditions,
  bufferReportCheckboxLabels,
  salesAgentTableRows,
} from '@/utils/constants';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import DateSelect from '@/components/DateSelect/DateSelect';
import CheckBoxes from '@/components/CheckBoxesGroup/CheckBoxes';
import Actions from '@/components/Actions/Actions';

const BufferReport: React.FC = () => {
  return (
    <section className="section dark:text-white">
      <div className="px-4 pt-2 pb-2 mb-3 flex items-center">
        <div className="flex items-center gap-2 max-w-[200px]">
          <span className="text-xs">Branch</span>
          <Select>
            <SelectTrigger className="w-[1800px]">
              <SelectValue className="text-xs" placeholder="select branch" />
            </SelectTrigger>
            <SelectContent>
              {bufferReportADS.map((store, idx) => {
                return (
                  <SelectItem key={idx} value={store}>
                    {store}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <span className="pl-4 pr-2 text-xs">From:</span>
        <div className="">
          <DateSelect />
        </div>
        <span className="pl-4 pr-2 text-xs">To:</span>
        <div className="">
          <DateSelect />
        </div>
        <div className="ml-6">
          <Select>
            <SelectTrigger className="w-[140px]">
              <SelectValue className="text-xs" placeholder="Buffer" />
            </SelectTrigger>
            <SelectContent defaultValue="Buffer">
              <SelectItem value="Buffer">Buffer</SelectItem>
              <SelectItem value="Accept">Accept</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-4 justify-center mb-4">
        <CheckBoxes labels={bufferReportCheckboxLabels} />
      </div>
      <hr />
      <div className="p-2 border h-auto m-2 rounded dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={bufferReportTableSearchConditions} />
            <Actions data={bufferReportActions} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {salesAgentTableRows.map((item, index) => {
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
      </div>
    </section>
  );
};

export default BufferReport;
