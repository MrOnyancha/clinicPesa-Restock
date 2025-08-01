import React from 'react';
import DateSelect from '@/components/DateSelect/DateSelect';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SearchGroup from '@/components/SearchGroup/SearchGroup';
import {
  listOfProductsPurchasedActions,
  productsPuchasedOptions,
  productsPurchasedRows,
  searchproductsPurchasedTableConditions,
} from '@/utils/constants';
import Actions from '@/components/Actions/Actions';
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

const ListOfProductsPurchased: React.FC = () => {
  return (
    <section className="shadow border border-slate-200 flex">
      <aside className="w-[250px] min-h-screen  border-r p-4">
        <h4 className="text-sm font-medium text-left">Options</h4>
        <div className="mt-2">
          <div className=" mt-2">
            <span className="text-xs my-3">Date of Accepatance</span>
            <DateSelect />
          </div>
        </div>
        <div className="flex justify-end mt-2">
          <button className=" bg-primary text-white text-xs rounded py-2 px-3 hover:bg-primary-dark">Return</button>
        </div>
      </aside>
      <div className=" border rounded w-full m-2">
        <div className="flex items-center p-2">
          <div className="flex relative items-center gap-3">
            <SearchGroup data={searchproductsPurchasedTableConditions} />
            <Actions data={listOfProductsPurchasedActions} />
            <div className="flex items-center gap-1">
              <span className="text-xs">Rows:</span>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue className="text-xs" placeholder="select rows" />
                </SelectTrigger>
                <SelectContent>
                  {productsPurchasedRows.map((item, index) => {
                    return (
                      <SelectItem value={item} key={index}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue className="text-xs" placeholder="Primary Report" />
              </SelectTrigger>
              <SelectContent defaultValue="Primary Report">
                {productsPuchasedOptions.map((item, index) => {
                  return (
                    <React.Fragment key={index}>
                      <span className="font-bold text-sm pl-2">{item.name}</span>
                      {item.options.map((option, idx) => {
                        return (
                          <SelectItem value={option} key={idx}>
                            {idx + 1}.<span className="pl-1">{option}</span>
                          </SelectItem>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mb-4 mt-4 w-full">
          <Table className="border-t">
            <TableCaption>A list of your recent purchased products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date Inv</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Serial No.</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Packs</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={9}>Total</TableCell>
                <TableCell>$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default ListOfProductsPurchased;
