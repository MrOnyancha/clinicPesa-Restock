import React from 'react'
import SearchableDropdown from '@/components/SearchableDropdown/SearchableDropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const ARPaymentTracker:React.FC = () => {
  return (
    <section className="m-2 p-2 shadow-md rounded">
      <div className="p-2 border rounded flex items-center justify-evenly">
        <div className="flex items-center gap-2">
          <span className="text-xs">Customer</span>
          <SearchableDropdown options={[]} id="" selectedVal="" handleChange={() => {}} />
        </div>
      
        <div className="flex items-center gap-2">
          <span className="text-xs">Years</span>
          <Select>
            <SelectTrigger className="w-[100px]">
              <SelectValue className="text-xs" placeholder="select rows" />
            </SelectTrigger>
            <SelectContent>
              {['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'].map((item, index) => {
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
    </section>
  );
}

export default ARPaymentTracker