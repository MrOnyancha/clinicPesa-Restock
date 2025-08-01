import React, { useState } from 'react';
import { Input } from '../ui/input';
// import { Checkbox } from '../ui/checkbox';

interface CheckBoxLabels {
  labels: string[];
}

const CheckBoxes: React.FC<CheckBoxLabels> = ({ labels }) => {
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);

  return (
    <React.Fragment>
      {labels.map((type, index) => {
        const isChecked = checkedIndices.includes(index);
        const toggleCheckbox = () => {
          if (isChecked) {
            setCheckedIndices(checkedIndices.filter((i) => i !== index));
          } else {
            setCheckedIndices([...checkedIndices, index]);
          }
        };

        return (
          // <div key={index} className="flex items-center gap-1">
          //   <Checkbox value={type} id={type} name={type} checked={isChecked} onChange={toggleCheckbox} />
          //   <label htmlFor={type}>
          //     <span className={`text-xs ${isChecked ? 'font-medium' : ''}`}>{type}</span>
          //   </label>
          // </div>
          <label className="flex items-center gap-1 " htmlFor={type} key={index}>
            <Input
              type="checkbox"
              value={type}
              id={type}
              name={type}
              checked={isChecked}
              onChange={toggleCheckbox}
              className="w-4 h-4 text-text-color bg-primary border-gray-300 dark:border-slate-600 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800  dark:bg-dark100 "
            />
            <span className={`text-xs ${isChecked ? 'font-medium' : ''}`}>{type}</span>
          </label>
        );
      })}
    </React.Fragment>
  );
};

export default CheckBoxes;
