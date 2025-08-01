import { InnerModal } from '@/components/Modal/Modal';
import { onOpenInnerModal } from '@/components/Modal/innerModalSlice';
import { useInnerModalDispatch, useInnerModalSelector } from '@/store/hooks';
import React, { useState } from 'react';
import CreateProductForm from '../../products/CreateProductForm';
import { ImCancelCircle } from 'react-icons/im';
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
import { productDetailsCheckboxLabels } from '@/utils/constants';
import CheckBoxes from '@/components/CheckBoxesGroup/CheckBoxes';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Input } from '@/components/ui/input';

const ProductDetailsForm: React.FC = () => {
  const [openModalText, setOpenModalText] = useState<string>('');
  const [productTableName, setProductTableName] = useState('Quantity of product');

  const dispatch = useInnerModalDispatch();
  const showInnerModal = useInnerModalSelector((state) => state.innerModal.isOpen);

  return (
    <React.Fragment>
      <div className="p-2 min-w-[900px] h-[800px] overflow-y-auto">
        <div className="p-2 w-full border rounde shadow-sm flex items-center justify-around">
          <div>
            <p className="text-xs">
              Product: <span className="text-sm font-medium">COFTA</span>
            </p>
            <p className="text-xs ">
              Latin Name: <span className="text-sm font-medium">Ammonium Chloride</span>
            </p>
            <p className="text-xs">
              Strength: <span className="text-sm font-medium">1mg</span>
            </p>
          </div>
          <div>
            <p className="text-xs">
              Country: <span className="text-sm font-medium">Kenya</span>
            </p>
            <p className="text-xs">
              Manufacturer: <span className="text-sm font-medium">GlaxoSmithKlein</span>
            </p>
            <p className="text-xs">
              Class: <span className="text-sm font-medium"></span>
            </p>
          </div>
          <div>
            <p className="text-sm">
              Price: <span className="text-xl font-bold text-green-500">250</span>
            </p>
            <p className="text-sm">
              SOH: <span className="text-xl font-bold text-red-600">200</span> (
              <span className="font-medium">2.00</span>)
            </p>
          </div>
        </div>
        <div className="flex gap-4 my-2">
          <button
            type="button"
            onClick={() => {
              setOpenModalText('branch');
              dispatch(onOpenInnerModal());
            }}
            className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark"
          >
            Other Branch
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenModalText('product');
              dispatch(onOpenInnerModal());
            }}
            className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark"
          >
            Product
          </button>
        </div>
        <div className="border rounded w-fit">
          {['Quantity of product', 'Sale', 'Invoice/Delivery(IN)', 'Stock count', 'Price List/Strategy'].map(
            (txt, index) => {
              return (
                <button
                  type="button"
                  onClick={() => setProductTableName(txt)}
                  key={index}
                  className={`text-xs px-2 py-2 border-r border-b border-b-white ${productTableName === txt ? 'text-primary bg-slate-100 border-b-2 border-b-primary' : ''}`}
                >
                  {txt}
                </button>
              );
            },
          )}
        </div>
        {productTableName === 'Quantity of product' && (
          <div className="w-full border rounded mt-2">
            <Table>
              <TableCaption>A list of your recent Invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Branch</TableHead>
                  <TableHead>SAH</TableHead>
                  <TableHead>SAH (Pack)</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={1}>Report Total</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                  <TableCell className="text-left">$2,500.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
        {productTableName === 'Sale' && (
          <div className="w-full border rounded  mt-2 p-2">
            <div className="flex items-center gap-6 my-2">
              <CheckBoxes labels={productDetailsCheckboxLabels} />
            </div>
            <div className="flex items-center w-full my-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-nowrap">Date from</span>
                <DateSelect />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs">to</label>
                <DateSelect />
              </div>
              <button type="button" className="btn-primary">
                Search
              </button>
            </div>
            <div className="w-full border rounded  mt-2">
              <Table>
                <TableCaption>A list of your recent Invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Branch</TableHead>
                    <TableHead className="text-wrap">Quntity (Unit)</TableHead>
                    <TableHead>Quantity (Pack)</TableHead>
                    <TableHead className="text-nowrap">Purchase Value</TableHead>
                    <TableHead>Sales Value</TableHead>
                    <TableHead>Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Report Total</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
        {productTableName === 'Invoice/Delivery(IN)' && (
          <div className="w-full border rounded  mt-2 p-2">
            <div className="flex items-center justify-evenly">
              <div className="flex gap-2 items-center">
                <label className="text-xs">Search</label>
                <Input className=" w-full bg-slate-100 " />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-nowrap">Date from</span>
                <DateSelect />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-nowrap">to</span>
                <DateSelect />
              </div>
            </div>
            <div className="w-full border rounded  mt-2">
              <Table>
                <TableCaption>A list of your recent Invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Branch</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-nowrap">Invoice Number</TableHead>
                    <TableHead>Vendors</TableHead>
                    <TableHead>Serial No.</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Stock At Hand</TableHead>
                    <TableHead>Purchase Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={1}>Report Total</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
        {productTableName === 'Stock count' && (
          <div className="w-full border rounded shadow mt-2 p-2">
            <div className="flex items-center justify-evenly">
              <div className="flex items-center gap-2">
                <span className="text-xs text-nowrap">Date from</span>
                <DateSelect />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-nowrap">to</span>
                <DateSelect />
              </div>
            </div>
            <div className="w-full border rounded mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Branch</TableHead>
                    <TableHead>INV Date</TableHead>
                    <TableHead>INV Before</TableHead>
                    <TableHead>INV After</TableHead>
                    <TableHead>Difference</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Serial No.</TableHead>
                    <TableHead>Purchase Price</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={8}>Report Total</TableCell>
                    <TableCell className="text-left">$2,500.00</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
        {productTableName === 'Price List/Strategy' && <div className="w-full border rounded shadow mt-2"></div>}
      </div>
      {showInnerModal && openModalText === 'product' && (
        <InnerModal title="Edit Product">
          <CreateProductForm />
        </InnerModal>
      )}
      {showInnerModal && openModalText === 'branch' && (
        <InnerModal title="Detail Product other branch">
          <ImCancelCircle size={28} color="red" />
          <div>The connection could not be completed. Make sure you have internet and enabled VPN tunnel</div>
        </InnerModal>
      )}
    </React.Fragment>
  );
};

export default ProductDetailsForm;
