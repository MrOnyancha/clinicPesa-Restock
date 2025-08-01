import React from 'react';
import { MdOutlineResetTv } from 'react-icons/md';
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
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import Actions from '@/components/Actions/Actions';
import { cycleCountActions } from '@/utils/constants';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const CycleCount: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="section">
        <div className="w-full px-4 pt-2 pb-2 flex items-center justify-between">
          <h4 className="section-heading">Cycle Count</h4>
          <button onClick={() => dispatch(onOpenModal())} className="btn-primary">
            Create
          </button>
        </div>
        <hr />
        <div className="p-2 border h-auto m-2 rounded dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex relative items-center gap-3">
              <SearchGroup data={['All Text Columns', 'Branch', 'Group Product', 'Type', 'Create', 'Accept']} />
              <Actions data={cycleCountActions} />
            </div>
            <button
              onClick={() => dispatch(onOpenModal())}
              className="flex items-center text-xs bg-slate-100 p-2  border rounded border-slate-200 hover:bg-slate-200  transition-all duration-300"
            >
              <span>
                <MdOutlineResetTv size={18} />
              </span>
              Reset
            </button>
          </div>
          <div className="table">
            <Table>
              <TableCaption>A list of your recent Cycle Counts.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Edit</TableHead>
                  <TableHead>Dept Summary</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Accepted</TableHead>
                  <TableHead>Change of value</TableHead>
                  <TableHead>Group Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Create</TableHead>
                  <TableHead>Accept</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Link to="/admin/inventory">
                      <img src="/assets/pencil.png" height={18} width={18} />
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={5}>Total</TableCell>
                  <TableCell>$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </section>
      {showModal && (
        <Modal title="Create Inventory">
          <div className="w-[650px] m-3 p-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-nowrap">Group Product</span>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue className="text-xs" placeholder="Full" />
                </SelectTrigger>
                <SelectContent defaultValue="full">
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button type="button" className="btn-cancel">
                Cancel
              </button>
              <button type="button" className="btn-primary">
                Create
              </button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default CycleCount;
