import React, { useState } from 'react';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchUsersTableConditions, stockAtHandTableRows } from '@/utils/constants';
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
import { IoSettingsOutline } from 'react-icons/io5';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import { onOpenModal } from '@/components/Modal/modalSlice';
import Modal from '@/components/Modal/Modal';
import AddUserForm from '@/components/Forms/Tools/AddUserForm';
import EditUserForm from '@/components/Forms/Tools/EditUserForm';

const Users: React.FC = () => {
  const [modalText, setModalText] = useState<string | null>(null);
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  return (
    <React.Fragment>
      <section className="border rounded  m-2">
        <div className="flex relative items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <SearchGroup data={searchUsersTableConditions} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {stockAtHandTableRows.map((item, index) => {
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
            type="button"
            onClick={() => {
              setModalText('addUser');
              dispatch(onOpenModal());
            }}
            className="btn-primary"
          >
            Add User
          </button>
        </div>
        <div className="border-t mb-2">
          <Table>
            <TableCaption>A list of your recent users.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Full name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="w-[240px]">Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Permissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <img
                    src="/assets/pencil.png"
                    width={18}
                    height={18}
                    onClick={() => {
                      setModalText('editUser');
                      dispatch(onOpenModal());
                    }} className='cursor-pointer'
                  />
                </TableCell>
                <TableCell>Businge</TableCell>
                <TableCell>Businge Bisanga</TableCell>
                <TableCell>clinicPesa</TableCell>
                <TableCell>businge@clinicpesa.com</TableCell>
                <TableCell>+784564565</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>
                  <IoSettingsOutline size={20} className="text-primary cursor-pointer" />
                </TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>Total</TableCell>
                <TableCell className="text-left">20 Users</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>
      {showModal && modalText === 'addUser' && (
        <Modal title="Add User">
          <AddUserForm />
        </Modal>
      )}
      {showModal && modalText === 'editUser' && (
        <Modal title="Edit User">
          <EditUserForm />
        </Modal>
      )}
    </React.Fragment>
  );
};

export default Users;
