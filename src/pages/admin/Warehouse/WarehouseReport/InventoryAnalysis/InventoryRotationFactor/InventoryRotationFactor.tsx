import React, { useState } from 'react';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IRCCheckboxLabels, bufferReportADS } from '@/utils/constants';
import CheckBoxes from '@/components/CheckBoxesGroup/CheckBoxes';
import { TfiHelpAlt } from 'react-icons/tfi';

const InventoryRotationFactor: React.FC = () => {
  const [showAnticipatedStockingDetails, setAnticipatedStockingDetails] = useState<boolean>(false);
  const [showRotationFactorDetails, setShowRotationFactorDetails] = useState<boolean>(false);

  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] h-fit overflow-hidden border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Branch</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {bufferReportADS.map((item, index) => {
                  return (
                    <SelectItem value={item} key={index}>
                      {item}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Rotation Factor</span>
            <div className="flex flex-col gap-1">
              <CheckBoxes labels={IRCCheckboxLabels} />
            </div>
          </div>
          <p
            onClick={() => setAnticipatedStockingDetails((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer hover:underline pt-3"
          >
            <span className="text-xs">Anticipated Stocking</span>
            <TfiHelpAlt />
          </p>
          <div
            style={{
              height: showAnticipatedStockingDetails ? '160px' : '0px',
              transition: 'height 0.5s ease',
            }}

            // className={`transition duration-200 ease-in-out mb-2 ${showAnticipatedStockingDetails ? 'opacity-100 transition-all duration-300 ease-in-out transform translate-y-0 max-h-auto ' : 'opacity-0 transition-all h-0 duration-300 ease-in-out transform -translate-y-2'}`}
          >
            {showAnticipatedStockingDetails && (
              <div className="border rounded w-full h-auto p-2 mt-1">
                <p className="text-xs font-medium py-0.5">
                  SALE (30day) = <span className="font-bold text-sm">170</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  SAH = <span className="font-bold text-sm">465</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  (SAH/(DAY)) = <span> 170/30 </span>= <span className="font-bold text-sm">5,667</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  Sale / (SAH / (DAY))= <span>465/(33/30) </span>= <span>465/5,667</span>=
                  <span className="font-bold text-sm">82</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  While maintaining such monthly outgoings. The commodity should be sufficient for 82 days.
                </p>
              </div>
            )}
          </div>
          <p
            onClick={() => setShowRotationFactorDetails((prev) => !prev)}
            className={`flex items-center gap-2 cursor-pointer hover:underline pt-3 ${showAnticipatedStockingDetails ? 'mt-5' : 'mt-0'}`}
          >
            <span className="text-xs ">Rotation Factor</span>
            <TfiHelpAlt />
          </p>
          <div
            style={{
              height: showRotationFactorDetails ? '80px' : '0px',
              transition: 'height 0.5s ease',
              marginBottom: showRotationFactorDetails ? '20px' : '0px',
            }}
            // className={`transition duration-200 mb-2 ease-in-out ${showRotationFactorDetails ? 'opacity-100 transition-all duration-300 ease-in-out transform translate-y-0 max-h-auto ' : 'opacity-0 transition-all h-0  duration-300 ease-out transform -translate-y-2'}`}
          >
            {showRotationFactorDetails && (
              <div className="border rounded w-full h-auto p-2 mt-1">
                <p className="text-xs font-medium py-0.5">
                  SALE (30day) = <span className="font-bold text-sm">170</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  SAH = <span className="font-bold text-sm">465</span>
                </p>
                <p className="text-xs font-medium py-0.5">
                  (SAH/(SAH)) %= <span> 170/465 </span>= <span className="font-bold text-sm">37%</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Return</button>
        </div>
      </aside>
      <div className="flex-1 shadow-md rounded m-2">
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

export default InventoryRotationFactor;
