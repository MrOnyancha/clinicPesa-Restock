import React, { useState } from 'react';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { puchaseHistoyADS } from '@/utils/constants';
import { Input } from '@/components/ui/input';
import { FaList } from 'react-icons/fa';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import DateSelect from '@/components/DateSelect/DateSelect';

const DeliveryNoteDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="shadow min-h-screen  border border-slate-200 flex">
        <aside className="w-[250px] border-r p-4">
          <h4 className="text-sm font-medium text-left">Parameters</h4>
          <div className="mt-2">
            <div className="mb-1">
              <span className="text-xs">Source</span>
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
            <div className="mb-1">
              <span className="text-xs">Destination</span>
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
            <div className="my-2">
              <span className="text-xs">Products</span>
              <div className="flex items-center gap-2">
                <Input
                  value={searchTerm}
                  onChange={(e) => {
                    if (e.type) {
                      dispatch(onOpenModal());
                    }
                    setSearchTerm(e.target.value);
                  }}
                />
                <span onClick={() => dispatch(onOpenModal())} className="cursor-pointer">
                  <FaList size={20} />
                </span>
              </div>
            </div>
            <div className=" mt-2">
              <span className="text-xs my-3">Date range</span>

              <DateSelect />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button className="ml-auto bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Return
            </button>
          </div>
        </aside>
        <div className="flex-1 shadow-md rounded m-2">
          <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
            <h4 className=" font-medium">Delivery Note Details</h4>
            <button
              type="button"
              className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
            >
              <span>
                <AiOutlineExpandAlt size={20} />
              </span>
            </button>
          </div>
        </div>
      </section>
      {showModal && <Modal title="Search">{searchTerm}</Modal>}
    </React.Fragment>
  );
};

export default DeliveryNoteDetails;
