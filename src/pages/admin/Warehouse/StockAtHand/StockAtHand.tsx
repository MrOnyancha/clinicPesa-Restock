import React from 'react';
import Actions from '@/components/Actions/Actions';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TbReportAnalytics } from 'react-icons/tb';
import { MdOutlinePivotTableChart } from 'react-icons/md';
import {
  searchStockAtHandConctions,
  stockAtHandActions,
  stockAtHandOptions,
  stockAtHandTableRows,
} from '@/utils/constants';

const StockAtHand: React.FC = () => {
  // const [showPivotModal, setShowPivorModa] = useState<boolean>(false);
  // const [togglePivotBtn, setTogglePivotBtn] = useState<boolean>(false);


  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 ">
        <h4 className=" font-medium">Stock At Hand</h4>
      </div>
      <hr />
      <div className="p-2 border h-auto m-2 rounded">
        <div className="flex items-center ">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchStockAtHandConctions} />
            <Actions data={stockAtHandActions} />
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
            <div className="flex items-center h-7 w-16 border rounded">
              <div className="border-r h-full w-full flex items-center justify-center  cursor-pointer hover:bg-slate-100">
                <TbReportAnalytics size={20} />
              </div>
              <div className="border-r h-full w-full flex items-center justify-center  cursor-pointer hover:bg-slate-100">
                <MdOutlinePivotTableChart size={20} />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue className="text-xs" placeholder="Primary Report" />
              </SelectTrigger>
              <SelectContent defaultValue="Primary Report">
                {stockAtHandOptions.map((item, index) => {
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
        <div className="p2 my-2 border rounded w-fit flex items-center gap-3">
          {/* <div
            onClick={() => setTogglePivotBtn((prev) => !prev)}
            className={`border cursor-pointer rounded bg-slate-100 w-8 h-8 flex items-center justify-center ${togglePivotBtn ? 'border-primary' : ''}`}
          >
            {togglePivotBtn ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
          </div> */}
          <button>Edit Pivot</button>
          <button>Pivot</button>
          <button>cancel</button>
        </div>
      </div>
    </section>
  );
};

export default StockAtHand;
