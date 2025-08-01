import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';



const ReportForInstitutions: React.FC = () => {
  return (
    <section className="m-2 p-2 border rounded">
      <div className="flex items-center justify-evenly">
        <div className="flex items-center gap-2">
          <span className="text-xs">Select Date</span>
          <DateSelect />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Institution</span>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {[].map((item, index) => {
                return (
                  <SelectItem value={item} key={index}>
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">No.</span>
          <Input />
        </div>
      </div>
      <div className='w-full my-4 rounded p-4 border'>Refund</div>
      <div className='w-full my-4 rounded p-4 border'>Values</div>
    </section>
  );
};

export default ReportForInstitutions;
