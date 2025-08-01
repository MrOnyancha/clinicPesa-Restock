import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employeeNames } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';

const ChangeHistoryAll: React.FC = () => {
  return (
    <section className="shadow min-h-screen  border border-slate-200 flex">
      <aside className="w-[250px] border-r p-4">
        <h4 className="text-sm font-medium text-left">Filter</h4>
        <div className="mt-2">
          <div className="mb-1">
            <span className="text-xs">Change</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="vendors">Vendors</SelectItem>
                <SelectItem value="insuranceCompany">Insurance Company</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-xs">Date from</span>
            <DateSelect />
          </div>
          <div>
            <span className="text-xs">Date to</span>
            <DateSelect />
          </div>
          <div className="mb-1">
            <span className="text-xs">Employee</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employeeNames.map((item, index) => {
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
        <div className="flex justify-end mt-3">
          <button type="button" className="btn-primary">
            Show
          </button>
        </div>
      </aside>
      <div className="flex-1 border rounded m-2">
        <div className="w-full px-4 pt-2 pb-2 ">
          <h4 className=" font-medium">Price</h4>
        </div>
        <hr />
      </div>
    </section>
  );
};

export default ChangeHistoryAll;
