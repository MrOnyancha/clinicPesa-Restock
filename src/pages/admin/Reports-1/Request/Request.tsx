import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Input } from '@/components/ui/input';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';

const Request: React.FC = () => {
  return (
    <section className="m-2">
      <div className="flex items-center gap-10 justify-center mt-3">
        <div className="flex items-start gap-4">
          <span className="text-xs">Analyzed period</span>
          <div className="flex flex-col items-center gap-3">
            <DateSelect />
            <DateSelect />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-nowrap">Stock Days</span>
          <Input />
          <button type="button" className="btn-primary">
            Show
          </button>
        </div>
      </div>
      <div className="border rounded p-2 my-2">
        <div className="flex relative items-center gap-3">
          <SearchGroup
            data={['All columns', 'Branch', 'ID', 'Product', 'Klasa', 'Quantity sold', 'Stock', 'Quantity to order']}
          />
          <Actions data={[]} />
        </div>
      </div>
    </section>
  );
};

export default Request;
