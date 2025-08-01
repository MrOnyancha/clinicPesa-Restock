import React from 'react';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { productAuditActions } from '@/utils/constants';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';

const PerfomaInvoice: React.FC = () => {
  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-4 border rounded border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="font-medium p-4">PerfomaInvoice</h4>
          <button
            onClick={() => dispatch(onOpenModal())}
            type="button"
            className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
          >
            <span className="block size-full">Create</span>
          </button>
        </div>
        <hr />
        <div className=" p-2 border rounded w-full m-2">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={['All Columns', 'Invoice No.', 'Branch', 'User']} />
            <Actions data={productAuditActions} />
          </div>
        </div>
      </section>
      {showModal && <Modal title="Perfoma Invoice">gsdf</Modal>}
    </React.Fragment>
  );
};

export default PerfomaInvoice;
