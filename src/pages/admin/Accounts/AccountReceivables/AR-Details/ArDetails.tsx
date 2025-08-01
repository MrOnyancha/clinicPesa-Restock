import React, { useState } from 'react';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { FaList } from 'react-icons/fa';
import Modal from '@/components/Modal/Modal';
import DateSelect from '@/components/DateSelect/DateSelect';
import CheckBoxes from '@/components/CheckBoxesGroup/CheckBoxes';
import { FiRefreshCw } from 'react-icons/fi';

const ArDetails: React.FC = () => {
  //T0 DO:=> Fix which Modal children should be displayed based on either customer or branch search
  const [searchBranchTerm, setSearchBranchTerm] = useState<string>('');
  const [searchCustomerTerm, setSearchCustomerTerm] = useState<string>('');
  
  // const [showBranchModal, setShowBranchModal] = useState<boolean>(showModal && false);
  // const [showCustomerModal, setShowCustomerModal] = useState<boolean>(showModal && false);
  
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="m-4 shadow flex border border-slate-200">
        <aside className="w-[250px] min-h-screen  border-r p-4">
          <h4 className="text-sm font-medium text-left">Options</h4>
          <div className="mt-2 h-fit w-full">
            <div className="my-2">
              <span className="text-xs">Branch</span>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="All"
                  value={searchBranchTerm}
                  onChange={(e) => {
                    if (e.type) {
                      dispatch(onOpenModal());
                    }
                    setSearchBranchTerm(e.target.value);
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
            <div className="my-2">
              <span className="text-xs">Customer</span>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="All"
                  value={searchCustomerTerm}
                  onChange={(e) => {
                    if (e.type) {
                      dispatch(onOpenModal());
                    }
                    setSearchCustomerTerm(e.target.value);
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
            <div className="mt-4 mb-4">
              <RadioGroup className="flex">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem onClick={() => {}} value="Sales Date" id="salesdate" />
                  <label htmlFor="salesdate" className="text-xs">
                    Sales Date
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
            <hr />
            <p className="text-sm font-medium pt-4">Invoice</p>
            <div>
              <span className="text-xs">Choose Date</span>
              <DateSelect />
            </div>
            <div className="flex items-end justify-between mt-3">
              <CheckBoxes labels={['Outstanding Credit', 'Paid']} />
            </div>
            <button className="flex items-center justify-center mt-4 bg-primary w-full text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">
              Refresh
              <span className="pl-2">
                <FiRefreshCw size={20} />
              </span>
            </button>
          </div>
        </aside>
        <div className="w-full border rounded p-2 m-2"></div>
      </section>
      {showModal && <Modal title="Search">{searchBranchTerm}</Modal>}
      {/* {showModal && showCustomerModal && <Modal title="Search">{searchCustomerTerm}</Modal>} */}
    </React.Fragment>
  );
};

export default ArDetails;
