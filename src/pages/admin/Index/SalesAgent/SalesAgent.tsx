import React from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { salesAgentActions, salesAgentTableRows, searchSalesAgentTableConditions } from '@/utils/constants';
import Actions from '@/components/Actions/Actions';
import SalesAgentForm from '@/components/Forms/SalesAgent/SalesAgentForm';

const SalesAgent: React.FC = () => {
  const dispatch = useModalDispatch();
  const showModal = useModalSelector((state) => state.modal.isOpen);

  return (
    <React.Fragment>
      <section className="m-4 shadow  border border-slate-200">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchSalesAgentTableConditions} />
            <Actions data={salesAgentActions} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {salesAgentTableRows.map((item, index) => {
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
            <TableCaption>A list of your recent Vendors.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>-</TableHead>
                <TableHead className="w-[400px]">Name</TableHead>
                <TableHead className="w-[250px]">Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Mail</TableHead>
                <TableHead>Currency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5}>Total</TableCell>
                <TableCell>$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
      {showModal && (
        <Modal title="Edit Sales Agent">
          <SalesAgentForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default SalesAgent;
