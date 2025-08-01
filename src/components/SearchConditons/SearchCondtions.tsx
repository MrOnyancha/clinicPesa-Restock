import React, { useState, RefObject } from 'react';
import { MdOutlineCheck, MdOutlineRadioButtonChecked } from 'react-icons/md';


interface SearchCondtionsProps {
  data: any[];
  refValue: RefObject<HTMLUListElement>;
  onShowSearchConditions: (showAction: boolean) => void;
  clickedSearchCondition: string;
  onSetClickedSearchCondition: (condition: string) => void;
}
// TO BeFixed:=>DEBUG: THE VALUE OF clickedSearchCondition IS NOT EQUAL TO THE condition
const SearchCondtions: React.FC<SearchCondtionsProps> = ({
  data,
  refValue,
  onShowSearchConditions,
  clickedSearchCondition,
  onSetClickedSearchCondition,
}) => {

  const [caseSensitive, setCaseSensitive] = useState<boolean>(false); //To Be Fixed:=> THERE IS UNEXPECTED BEHAVIOUR HERE WHEN ITEM IS CLICKED

  return (
    <ul className={`transition-all absolute shadow-md top-9 rounded-md bg-white duration-300 z-50 `} ref={refValue}>
      <div
        onClick={() => {
          setCaseSensitive((prev) => !prev); //To Be Fixed:=> THERE IS UNEXPECTED BEHAVIOUR HERE WHEN ITEM IS CLICKED

          //   console.log(caseSensitive);
          onShowSearchConditions(false);
        }}
        className={`text-xs py-2  block w-full text-text-color ${caseSensitive ? 'pl-1 pr-4 bg-primary text-white' : 'p-6'} cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300`}
      >
        <span className="flex items-center gap-2">
          {caseSensitive && <MdOutlineCheck size={20} />}
          Case Sensitive
        </span>
      </div>
      {data.map((condition, index) => {
        return (
          <li
            onClick={() => {
              console.log(clickedSearchCondition);
              onSetClickedSearchCondition(condition);
              onShowSearchConditions(false);
              setCaseSensitive(caseSensitive)
            }}
            key={index}
            className={`text-xs py-2  block w-full cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300
                     ${clickedSearchCondition === condition ? 'pl-1 pr-4' : 'text-text-color px-6'}`}
          >
            <div className="flex items-center gap-2">
              {clickedSearchCondition === condition && <MdOutlineRadioButtonChecked />}

              {condition}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default SearchCondtions;
