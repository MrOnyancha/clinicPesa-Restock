import React from 'react';
import Modal from '@/components/Modal/Modal';
import { onOpenModal } from '@/components/Modal/modalSlice';
import { useModalDispatch, useModalSelector } from '@/store/hooks';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';

const DocumentNumbering: React.FC = () => {
  const showModal = useModalSelector((state) => state.modal.isOpen);
  const dispatch = useModalDispatch();

  // useEffect(() => {
  //   dispatch(onOpenModal());
  // }, []);

  return (
    <React.Fragment>
      <section className="m-2 p-2 rounded border">
        <div className="w-full px-4 pt-2 pb-2 ">
          <h4 className=" font-medium">Document Numbering</h4>
        </div>
        <Table className="border rounded">
          <TableCaption>Document Numbering</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>-</TableHead>
              <TableHead>Last number</TableHead>
              <TableHead>Sufix</TableHead>
              <TableHead>Short name</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <img
                  src="/assets/pencil.png"
                  width={18}
                  height={18}
                  className="cursor-pointer"
                  onClick={() => dispatch(onOpenModal())}
                />
              </TableCell>
              <TableCell>9</TableCell>
              <TableCell>/2024/clinicPesa </TableCell>
              <TableCell>Damage</TableCell>
              <TableCell>Damaged Product</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
      {showModal && (
        <Modal title="Document Numbering">
          <div className="w-[600px]">
            <div className="flex items-center justify-center gap-6 mb-3">
              <div>
                <label className="text-xs" htmlFor="lastnumber">
                  Last Number
                </label>
                <Input id="lastnumber" />
              </div>
              <div>
                <label className="text-xs" htmlFor="lastnumber">
                  Suffix
                </label>
                <Input id="lastnumber" />
              </div>
            </div>
            <div className="flex gap-2 items-center mb-1">
              <div className="w-24 block text-right">
                <span className="text-xs text-right">
                  Short name:
                </span>
              </div>
             <span className='font-medium'>Auto-order</span>
            </div>
            <div className="flex gap-2 items-center mb-1">
              <div className="w-24 block text-right">
                <span className="text-xs text-right">
                  Name:
                </span>
              </div>
             <span className='font-medium'>Auto-order</span>
            </div>
            <hr/>
            <div className='flex items-center justify-between p-2'>
              <button type='button' className='btn-cancel'>Cancel</button>
              <button type='button' className='btn-primary'>Apply Changes</button>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
};

export default DocumentNumbering;
