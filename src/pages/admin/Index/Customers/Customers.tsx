import React, { useEffect } from 'react';
import { MdOutlineResetTv } from 'react-icons/md';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
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
import { useModalDispatch, useModalSelector, useTSelector } from '@/store/hooks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Actions from '@/components/Actions/Actions';
import { CustomerActions, searchCustomerTableConditions } from '@/utils/constants';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import CreateCustomerForm from '@/components/Forms/customers/CreateCustomerForm';
import { customersList } from './customerSlice';

const Customers: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  const customers = useTSelector((state) => state.customers.customers);

  useEffect(() => {
    dispatch(customersList(undefined));
  }, [dispatch]);

  console.log(customers);

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="section-heading">Customers</h4>
          <div className="flex items-center gap-2">
            <button className="bg-slate-100 p-2 text-xs border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
              Info
            </button>

            <button
              onClick={() => dispatch(onOpenModal())}
              type="button"
              className="bg-primary text-white p-2 text-xs shadow-lg rounded hover:bg-primary-dark"
            >
              <span className="block size-full">Create</span>
            </button>
          </div>
        </div>
        <hr />
        <div className="p-2 border h-auto m-2 rounded dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={searchCustomerTableConditions} />
              <Actions data={CustomerActions} />
              <div>
                <Select>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue className="text-xs" placeholder="primary report" />
                  </SelectTrigger>
                  <SelectContent defaultValue="Primary Report">
                    <SelectItem value="Primary Report">Primary Report</SelectItem>
                    <SelectItem value="Test">Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <button className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300">
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </button>
          </div>
          <div className="table">
            <Table>
              <TableCaption>A list of your recent Customers.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">-</TableHead>
                  <TableHead>Customer Number</TableHead>
                  <TableHead>Created in a branch</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mail</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Insurance</TableHead>
                  <TableHead>Sales Agent</TableHead>
                  <TableHead>Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody></TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={8}>Total</TableCell>
                  <TableCell>$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
      {showModal && (
        <Modal title="Customer Card">
          <CreateCustomerForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Customers;
