import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { GoChevronUp } from 'react-icons/go';
import { Input } from '../ui/input';

interface Option {
  id: number;
  name: string;
}
interface Props {
  options: Option[];
}

const SearchableDropdown: React.FC<Props> = ({ options,  }) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChange = (value: string | null) => {
    setSelectedValue(value);
  };

  const selectOption = (option: Option) => {
    setQuery('');
    handleChange(option.name);
    setIsOpen((isOpen) => !isOpen);
  };

  function toggle(e: React.MouseEvent<HTMLInputElement>) {
    setIsOpen(!!(e && e.target === inputRef.current));
  }

  const getDisplayValue = (): string => {
    if (query) return query;
    if (selectedValue) return selectedValue;
    return '';
  };

  const filter = (options: Option[]): Option[] => {
    return options.filter((option) => option.name?.toLowerCase().indexOf(query.toLowerCase()) > -1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleChange(null);
  };

  return (
    <div className="relative w-full text-gray-700 cursor-default">
      <div className="w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Select option..."
            value={getDisplayValue()}
            name="searchTerm"
            onChange={handleInputChange}
            onClick={toggle}
            className="py-2 px-3 w-full text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition duration-200 dark:text-white  dark:border-slate-700 dark:bg-dark50 dark:ring-0 dark:focus-visible:ring-dark100"
          />
          <div
            className={`absolute right-4 top-2 transition-all duration-500 ${isOpen ? 'transform rotate-180' : ''} dark:text-white`}
          >
            <GoChevronUp />
          </div>
        </div>
      </div>

      <div
        className={`mt-1 absolute border rounded z-50 bg-white dark:bg-dark50 dark:border dark:border-slate-600  w-full ${isOpen ? 'opacity-100 transition-all duration-300 ease-in-out transform translate-y-0 max-h-[200px] overflow-y-auto' : 'opacity-0 transition-all h-0 duration-300 ease-in-out transform -translate-y-2'}`}
      >
        <div className="h-full overflow-y-auto rounded-b-lg">
          {filter(options).map((option, index) => {
            return (
              <div
                onClick={() => selectOption(option)}
                className={`py-1 px-3 text-xs cursor-pointer hover:bg-blue-100 dark:text-white dark:hover:bg-dark100 dark:hover:text-primary ${option.name === selectedValue ? 'bg-primary text-white' : 'text-text-color'}`}
                key={index}
              >
                {option.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchableDropdown;
