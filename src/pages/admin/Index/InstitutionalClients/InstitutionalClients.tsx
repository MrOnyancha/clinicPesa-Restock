import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import InsuranceCompanyForm from '@/components/Forms/InstitutionalClients/InsuranceCompanyForm';

const InstitutionalClients:React.FC = () => {
    const dispatch = useModalDispatch();
    const showModal = useModalSelector((state) => state.modal.isOpen);
  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className=" font-medium">Insurance Company</h4>
          <button
            onClick={() => dispatch(onOpenModal())}
            type="button"
            className="bg-primary text-xs text-white px-2 py-2 shadow-lg rounded hover:bg-primary-dark"
          >
            <span className="block size-full">Create</span>
          </button>
        </div>
        <hr />
        <div className="mb-4 mt-4 h-auto m-2  border">
          <Table>
            <TableCaption>A list of your recent Insurance Companies.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>-</TableHead>
                <TableHead className="w-[500px]">Name</TableHead>
                <TableHead className="w-[350px]">Phone</TableHead>
                <TableHead className="text-right">Mail</TableHead>
                <TableHead className="text-right">Patients</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
      {showModal && (
        <Modal title="Edit Insurance Company">
          <InsuranceCompanyForm />
        </Modal>
      )}
    </React.Fragment>
  );
}

export default InstitutionalClients