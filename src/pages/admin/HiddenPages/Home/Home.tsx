import React from 'react';
import { FullscreenHookReturnType, useFullscreen } from '@/utils/useFullScreen';
import { AiOutlineExpandAlt } from 'react-icons/ai';
import { FiMinimize2 } from 'react-icons/fi';
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

const Home: React.FC = () => {
  const { fullscreenRef, fullscreenActive, enterFullscreen, exitFullscreen }: FullscreenHookReturnType =
    useFullscreen();

  return (
    <section>
      <div ref={fullscreenRef as React.RefObject<HTMLDivElement>} className="m-2 border  rounded">
        <div className=" bg-[#a64940]  px-4 py-2  flex items-center justify-between">
          <h4 className="text-white font-medium">Buffer</h4>
          <button
            type="button"
            className="text-text-color cursor-pointer p-2 text-xs shadow-lg rounded bg-slate-100 border"
          >
            <span onClick={fullscreenActive ? exitFullscreen : enterFullscreen}>
              {fullscreenActive ? <FiMinimize2 size={20} /> : <AiOutlineExpandAlt size={20} />}
            </span>
          </button>
        </div>
        <div className="mb-4 mt-4 h-auto m-2  border">
          <Table>
            <TableCaption>A list of your recent buffers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Other</TableHead>
                <TableHead className="text-center">No.</TableHead>
                <TableHead className="text-center">Date</TableHead>
                <TableHead className="text-center">Username</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody></TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell>$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
      <div className="flex items-center mb-3">
        <div className="w-full border rounded m-2 h-10">
          <div className="bg-[#4d7d3a]  px-4 py-2">
            <h4 className="text-white font-medium">Expiry Date</h4>
          </div>
          <div className="w-full flex items-center justify-end">
            <div className="my-1 mr-2 w-[100px] flex items-center gap-2">
              <span className="text-xs">Day</span>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>No data yet</div>
        </div>
        <div className="w-full border rounded m-2 h-10">
          <div className="bg-[#4d7d3a]  px-4 py-2">
            <h4 className="text-white font-medium">Holding Cup</h4>
          </div>
          <div>No data yet</div>
        </div>
      </div>
      <div className="flex items-center mb-3">
        <div className='py-2 px-2'>
          <h4 className="font-medium">Invoice</h4>
        </div>
      </div>
    </section>
  );
};

export default Home;
