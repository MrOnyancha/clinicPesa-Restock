import React, { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ApDetails: React.FC = () => {
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
              <label htmlFor='vendors' className="text-xs">Vendors</label>
              <div className="flex items-center gap-2">
                <Input name='vendors' id='vendors'
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
              <RadioGroup className="flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem onClick={() => {}} value="Puchase Date" id="purchasedate" />
                  <label htmlFor="purchasedate" className="text-xs">
                    Purchase Date
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem onClick={() => {}} value="payment Date" id="paymentdate" />
                  <label htmlFor="paymentdate" className="text-xs">
                    Payment Date
                  </label>
                </div>
              </RadioGroup>
            </div>
            <Link
              to="/admin/accounts/apagingreport"
              className="mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark"
            >
              Accounts Payable Aging Report
            </Link>
          </div>
        </aside>
      </section>
      {showModal && <Modal title="Search">{searchTerm}</Modal>}
    </React.Fragment>
  );
};

export default ApDetails;
