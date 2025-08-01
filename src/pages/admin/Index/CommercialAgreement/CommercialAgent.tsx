import React from 'react';

const CommercialAgent: React.FC = () => {
  return (
    <section className="m-4 shadow  border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2">
        <h4 className=" font-medium">Commercial Agreement Printout of Automativ orders</h4>
      </div>
      <hr />
      <div className="p-2 border h-auto my-2 mx-10 rounded"></div>
      <div className="m-4 flex items-center justify-between">
        <button className="bg-slate-100 p-2 text-xs border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
          Cancel
        </button>
        <button className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark">
          Apply Changes
        </button>
      </div>
    </section>
  );
};

export default CommercialAgent;
