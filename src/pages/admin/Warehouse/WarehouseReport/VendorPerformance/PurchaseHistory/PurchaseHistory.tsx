import React from 'react';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';

const PurchaseHistory: React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Parameters</h4>
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
        </div>
        <div className="flex justify-end">
          <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
            Return
          </button>
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

export default PurchaseHistory;
