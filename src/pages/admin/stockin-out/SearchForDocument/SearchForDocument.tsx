import React from 'react';
import { Input } from '@/components/ui/input';


const SearchForDocument: React.FC = () => {
  return (
    <section className="section">
      <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
        <h4 className="section-heading">Search For a Document</h4>
      </div>
      <hr />
      <div className="p-2 border h-auto m-2 rounded dark:border-slate-700">
        <div className="flex w-[400px] items-center gap-4">
          <label className="text-sm font-medium w-20 text-right dark:text-white">Bar code:</label>
          <Input className="h-10 bg-slate-100 rounded-sm" />
        </div>
      </div>
    </section>
  );
};

export default SearchForDocument;
