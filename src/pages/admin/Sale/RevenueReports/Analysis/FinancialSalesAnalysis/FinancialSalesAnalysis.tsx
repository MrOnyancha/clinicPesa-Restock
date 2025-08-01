import React, { useRef, useState } from 'react';
import { employeeNames, bufferReportADS } from '@/utils/constants';
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu';
import { MdOutlineResetTv } from 'react-icons/md';
import { RiSkipDownLine, RiSkipUpLine } from 'react-icons/ri';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DateSelect from '@/components/DateSelect/DateSelect';

const FinancialSalesAnalysis: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['Businge']);
  const [remainingEmployees, setRemainingEmployees] = useState<string[]>(employeeNames);

  const selectedEmployeesRef = useRef<HTMLUListElement>(null);

  const selectEmployee = (employeeName: string) => {
    setSelectedEmployee(employeeName === selectedEmployee ? null : employeeName);
  };

  const moveAllEmployees = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setSelectedEmployees([]);
      setRemainingEmployees([...remainingEmployees, ...selectedEmployees]);
    } else {
      setSelectedEmployees([...remainingEmployees, ...selectedEmployees]);
      setRemainingEmployees([]);
    }
  };

  const moveSingleEmployee = (direction: 'left' | 'right') => {
    if (selectedEmployee === null) return;

    if (direction === 'left') {
      if (!remainingEmployees.includes(selectedEmployee)) {
        setRemainingEmployees([...remainingEmployees, selectedEmployee]);
      }
      setSelectedEmployees(selectedEmployees.filter((name) => name !== selectedEmployee));
    } else {
      if (!selectedEmployees.includes(selectedEmployee)) {
        setSelectedEmployees([...selectedEmployees, selectedEmployee]);
      }
      setRemainingEmployees(remainingEmployees.filter((name) => name !== selectedEmployee));
    }
    setSelectedEmployee(null);
  };

  const resetEmployees = () => {
    setSelectedEmployees(['Businge']);
    setRemainingEmployees(employeeNames);
  };
  const scrollToTop = () => {
    if (selectedEmployeesRef.current) {
      selectedEmployeesRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const scrollToBottom = () => {
    if (selectedEmployeesRef.current) {
      selectedEmployeesRef.current.scrollTo({
        top: selectedEmployeesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollUpOneItem = () => {
    if (selectedEmployeesRef.current) {
      selectedEmployeesRef.current.scrollTo({
        top: selectedEmployeesRef.current.scrollTop - selectedEmployeesRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollDownOneItem = () => {
    if (selectedEmployeesRef.current) {
      selectedEmployeesRef.current.scrollTo({
        top: selectedEmployeesRef.current.scrollTop + selectedEmployeesRef.current.clientHeight,
        behavior: 'smooth',
      });
    }
  };
  return (
    <section>
      <div className="m-2 border rounded ">
        <h4 className="font-medium p-2 ">Parameters</h4>
        <hr />
        <div className="p-2 flex flex-col gap-2  w-[720px]">
          <div className="flex items-center w-full">
            <div className="w-28 block text-right">
              <label htmlFor="date" className="text-right pr-3 text-xs font-medium">
                Select Date
              </label>
            </div>
            <div className="w-full">
              <DateSelect />
            </div>
          </div>
          <div className="flex items-center ">
            <div className="w-28 block text-right">
              <label className="pr-3 text-xs font-medium">Branch</label>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {bufferReportADS.map((item, index) => {
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
          <div className="flex items-start">
            <div className="w-28 block text-right">
              <p className="text-right pr-3 text-xs font-medium">Employee</p>
            </div>

            <div className="w-full flex items-center justify-between">
              <ul className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100">
                {remainingEmployees.map((employeeName, idx) => (
                  <li
                    className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300 ${selectedEmployee === employeeName ? 'bg-slate-300' : ''}`}
                    key={idx}
                    onClick={() => selectEmployee(employeeName)}
                  >
                    {employeeName}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={resetEmployees}
                >
                  <MdOutlineResetTv />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveAllEmployees('right')}
                >
                  <LuChevronsRight />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveSingleEmployee('right')}
                >
                  <LuChevronRight />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveSingleEmployee('left')}
                >
                  <LuChevronLeft />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={() => moveAllEmployees('left')}
                >
                  <LuChevronsLeft />
                </span>
              </div>
              <ul
                className="border rounded h-[140px] w-[200px] overflow-scroll bg-slate-100"
                ref={selectedEmployeesRef}
              >
                {selectedEmployees.map((employeeName, idx) => (
                  <li
                    className={`text-xs my-1 pl-2 py-1 transition-all duration-300 cursor-pointer hover:bg-slate-300`}
                    key={idx}
                    onClick={() => selectEmployee(employeeName)}
                  >
                    {employeeName}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col justify-between items-center h-[140px] w-7 ">
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollToTop}
                >
                  <RiSkipUpLine />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollUpOneItem}
                >
                  <LuChevronUp />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollDownOneItem}
                >
                  <LuChevronDown />
                </span>
                <span
                  className="cursor-pointer border border-transparent hover:border hover:rounded hover:bg-slate-200 p-1"
                  onClick={scrollToBottom}
                >
                  <RiSkipDownLine />
                </span>
              </div>
            </div>
          </div>
        </div>
        <button className="bg-primary text-white p-2 m-2 text-xs shadow-lg rounded hover:bg-primary-dark">
          Report
        </button>
      </div>
      <div className="m-2 p-4 border rounded ">Report</div>
    </section>
  );
};

export default FinancialSalesAnalysis;
