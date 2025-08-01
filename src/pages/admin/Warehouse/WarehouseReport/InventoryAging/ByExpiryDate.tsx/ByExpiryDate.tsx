import React, { useState } from 'react';
import Actions from '@/components/Actions/Actions';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import SearchableDropdown from '@/components/SearchableDropdown/SearchableDropdown';
import {
  animalsList2,
  animalsList1,
  searchAgingTableByExpiryConditions,
  agingByExpiryActions,
} from '@/utils/constants';

const ByExpiryDate: React.FC = () => {
  const [selectedAnimal1, setSelectedAnimal1] = useState<string | null>(null);
  const [selectedAnimal2, setSelectedAnimal2] = useState<string | null>(null);

  const handleAnimalChange1 = (value: string | null) => {
    setSelectedAnimal1(value);
  };
  const handleAnimalChange2 = (value: string | null) => {
    setSelectedAnimal2(value);
  };

  return (
    <section className="m-4 shadow min-h-screen border border-slate-200">
      <div className="w-full px-4 pt-2 pb-2 ">
        <h4 className=" font-medium">Aging based on expiry</h4>
      </div>
      <hr />
      <div className="flex items-center justify-evenly my-2">
        <div className="flex items-center gap-2">
          <span className="text-xs"> Branch</span>
          <SearchableDropdown
            options={animalsList1}
            id="branchselector"
            selectedVal={selectedAnimal1 || ''}
            handleChange={handleAnimalChange1}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">Vendor</span>
          <SearchableDropdown
            options={animalsList2}
            id="vendorselector"
            selectedVal={selectedAnimal2 || ''}
            handleChange={handleAnimalChange2}
          />
        </div>
      </div>
      <div className="mb-4 mt-4 p-2 h-auto m-2 border rounded">
        <div className="flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchAgingTableByExpiryConditions} />
            <Actions data={agingByExpiryActions} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ByExpiryDate;
