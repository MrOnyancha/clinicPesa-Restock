import React, { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import { MdOutlineCheck, MdOutlineRadioButtonChecked, MdSearch } from 'react-icons/md';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SearchGroupProps {
  data: string[];
}

const SearchGroup: React.FC<SearchGroupProps> = ({ data }) => {
  const [clickedSearchCondition, setClickedSearchCondition] = useState<string>('');

  return (
    <div className="flex h-8 items-center  border rounded dark:border-slate-700 dark:text-white">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`hover:bg-slate-200 dark:hover:bg-dark50 h-full transition-colors duration-300`}
        >
          <span className="flex items-center gap-1 h-full">
            <MdSearch size={20} className="ml-1" />
            <HiChevronDown />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0">
          <span className="flex py-1.5 items-center gap-2 text-xs cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300">
            <MdOutlineCheck size={20} />
            Case Sensitive
          </span>
          <DropdownMenuSeparator />
          {data?.map((text, idx) => {
            return (
              <DropdownMenuItem
                onClick={() => setClickedSearchCondition(text)}
                key={idx}
                className={`text-text-color  dark:text-white`}
              >
                <span className={`${clickedSearchCondition === text ? 'flex items-center gap-1' : 'px-6'}`}>
                  {clickedSearchCondition === text && <MdOutlineRadioButtonChecked />}
                  {text}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <Input placeholder={`Search: ${clickedSearchCondition}`} style={{ borderRadius: '0px' }} />
      <button
        type="button"
        className="px-2 cursor-pointer hover:bg-slate-100 h-full dark:hover:bg-dark50 transition-colors duration-300"
      >
        Go
      </button>
    </div>
  );
};

export default SearchGroup;
