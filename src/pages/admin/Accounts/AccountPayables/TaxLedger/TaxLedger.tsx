import React, { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { Input } from '@/components/ui/input';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { FaList } from 'react-icons/fa';
import { FiRefreshCw } from 'react-icons/fi';
import DateSelect from '@/components/DateSelect/DateSelect';

const TaxLedger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-4 shadow flex border border-slate-200">
        <aside className="w-[250px] min-h-screen  border-r p-4">
          <h4 className="text-sm font-medium text-left">Options</h4>
          <div className="mt-2 h-fit w-full">
            <div className="my-2">
              <span className="text-xs">Vendors</span>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="All"
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
            <div className="mt-4 mb-4">
              <span className='text-xs'>Date Accepted</span>
            <DateSelect/>
            </div>
            <button className="flex items-center justify-center mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Refresh
              <span className='px-2'>
                <FiRefreshCw size={20} />
              </span>
            </button>
          </div>
        </aside>
      </section>
      {showModal && <Modal title="Search">{searchTerm}</Modal>}
    </React.Fragment>
  );
};

export default TaxLedger;
