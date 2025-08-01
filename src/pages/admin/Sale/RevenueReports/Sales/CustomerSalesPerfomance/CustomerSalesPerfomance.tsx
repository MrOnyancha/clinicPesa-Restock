import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Input } from '@/components/ui/input';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { FaList } from 'react-icons/fa';
import Modal from '@/components/Modal/Modal';
import { AiOutlineExpandAlt } from 'react-icons/ai';

const CustomerSalesPerfomance: React.FC = () => {
  const [searchCustomerTerm, setCustomerBranchTerm] = useState<string>('');

  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();
  return (
    <React.Fragment>
      <section className="shadow flex border border-slate-200">
        <aside className="w-[250px] min-h-screen overflow-y-auto border-r p-4">
          <h4 className="text-sm font-medium text-left">Options</h4>
          <div className="flex justify-end items-center">
            <button className="flex items-center justify-center mt-2 bg-primary  text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Visual Analysis
            </button>
          </div>
          <div className="mt-2">
            <div className="mb-1">
              <span className="text-xs">Branch</span>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {puchaseHistoyADS.map((item, index) => {
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
          <div>
            <span className="text-xs">Choose Date</span>
            <DateSelect />
          </div>
          <div className="my-2">
            <span className="text-xs">Customer</span>
            <div className="flex items-center gap-2">
              <Input
                placeholder="All"
                value=""
                onChange={(e) => {
                  if (e.type) {
                    dispatch(onOpenModal());
                  }
                  setCustomerBranchTerm(e.target.value);
                }}
              />
              <span
                onClick={() => {
                  dispatch(onOpenModal());
                }}
                className="cursor-pointer"
              >
                <FaList size={20} />
              </span>
            </div>
          </div>
          <div className="mb-1">
            <span className="text-xs">Type</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dormant">All</SelectItem>
                <SelectItem value="Non-movers">Hospital</SelectItem>
                <SelectItem value="Slow sales">Pharmacy</SelectItem>
                <SelectItem value="Movers">Company</SelectItem>
                <SelectItem value="Fast Moving">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Sex</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dormant">All</SelectItem>
                <SelectItem value="Non-movers">Male</SelectItem>
                <SelectItem value="Slow sales">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Age Range</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dormant">All</SelectItem>
                <SelectItem value="Non-movers">0-5</SelectItem>
                <SelectItem value="Slow sales">6-18</SelectItem>
                <SelectItem value="Slow sales">19-35</SelectItem>
                <SelectItem value="Slow sales">36-45</SelectItem>
                <SelectItem value="Slow sales">46-55</SelectItem>
                <SelectItem value="Slow sales">56 and above</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-1">
            <span className="text-xs">Insurance</span>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dormant">All</SelectItem>
                <SelectItem value="Non-movers">Yes</SelectItem>
                <SelectItem value="Slow sales">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end mt-3">
            <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Report</button>
          </div>
        </aside>
        <div className="m-2 w-full border rounded">
          <div className="w-full bg-primary-dark  px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className="text-white font-medium">Sales Summary - Client</h4>
            <button
              type="button"
              className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
            >
              <span>
                <AiOutlineExpandAlt size={20} />
              </span>
            </button>
          </div>
          No data yet
        </div>
      </section>
      {showModal && <Modal title="Search">{searchCustomerTerm}</Modal>}
    </React.Fragment>
  );
};

export default CustomerSalesPerfomance;
