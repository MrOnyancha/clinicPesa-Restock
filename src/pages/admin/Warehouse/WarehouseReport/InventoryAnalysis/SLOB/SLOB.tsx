import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { puchaseHistoyADS } from '@/utils/constants';
import { TfiHelpAlt } from 'react-icons/tfi';

const SLOB: React.FC = () => {
  const [showLegendDetails, setShowLegendDetails] = useState(false);
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] h-fit overflow-hidden border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
        <div className="mt-2">
          <div className="mt-2 ">
            <RadioGroup className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="analytical" id="analytical" />
                <label htmlFor="purchase" className="text-xs">
                  Analytical
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem onClick={() => {}} value="synthetic" id="synthetic" />
                <label htmlFor="sale" className="text-xs">
                  Synthetic
                </label>
              </div>
            </RadioGroup>
          </div>
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
          <div className="mb-1">
            <span className="text-xs">Inventory Beginning</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-03-01">2024-03-01</SelectItem>
                <SelectItem value="2024-01-01">2024-01-01</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Inventory Ending</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-04-01">2024-04-01</SelectItem>
                <SelectItem value="2024-02-01">2024-02-01</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Days in Inventory</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select inventory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dormant">Dormant</SelectItem>
                <SelectItem value="Non-movers">Non-movers</SelectItem>
                <SelectItem value="Slow sales">Slow sales</SelectItem>
                <SelectItem value="Movers">Movers</SelectItem>
                <SelectItem value="Fast Moving">Fast Moving</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Department</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Pharma</SelectItem>
                <SelectItem value="2">OTC</SelectItem>
                <SelectItem value="3">Personal care(Beauty)</SelectItem>
                <SelectItem value="4">Mother and Baby</SelectItem>
                <SelectItem value="5">Sports & weights managemnt</SelectItem>
                <SelectItem value="6">Cosmetics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Category</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t1">Test 1</SelectItem>
                <SelectItem value="t2">Test2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Condition</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condtion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="t3">test3</SelectItem>
                <SelectItem value="t4">test4</SelectItem>
                <SelectItem value="t5">test5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p
            onClick={() => setShowLegendDetails((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer hover:underline pt-3"
          >
            <span className="text-xs">Legend</span>
            <TfiHelpAlt />
          </p>
          <div
            style={{ height: showLegendDetails ? '200px' : '0px', transition: 'height 0.5s ease',marginBottom:'25px' }}
            // className={`transition duration-200 mb-2 ease-in-out transform ${showLegendDetails ? 'opacity-100 translate-y-0 max-h-autoy-100 transition-all duration-300 ease-in-out transform  max-h-auto ' : 'opacity-0 -translate-y-2 h-0'}`}
          >
            {showLegendDetails && (
              <div className={`border rounded w-full h-auto p-2 mt-1`}>
                <p className="text-xs font-medium py-0.5">
                  1. Fast Moving = Days in Inventory: <span className="font-bold text-sm pr-1">0</span>days to
                  <span className="font-bold text-sm pl-1">30</span> days
                </p>
                <p className="text-xs font-medium py-0.5">
                  2. Movers = Days in Inventory: <span className="font-bold text-sm pr-1">31</span>days to
                  <span className="font-bold text-sm pl-1">60</span> days
                </p>
                <p className="text-xs font-medium py-0.5">
                  3. Slow Sales = Days in Inventory: <span className="font-bold text-sm pr-1">61</span>days to
                  <span className="font-bold text-sm pl-1">120</span> days
                </p>
                <p className="text-xs font-medium py-0.5">
                  4. Non-movers = Days in Inventory: <span className="font-bold text-sm pr-1">121</span>days to
                  <span className="font-bold text-sm pl-1">180</span> days
                </p>
                <p className="text-xs font-medium py-0.5">
                  5. Dormant = Days in Inventory: greater than <span className="font-bold text-sm pr-1">181</span>days
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Return
          </button>
        </div>
      </aside>
      <div className="flex-1 shadow-md rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Slow Moving and Obslete Inventory</h4>
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

export default SLOB;
