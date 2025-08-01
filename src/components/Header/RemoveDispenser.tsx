import React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';


type RemoveDispenserProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const roles = [
  'DISPENSER',
  'SUPERVISOR',
  'ACCOUNTANT',
  'MANAGER',
  'IT',
  'ADMIN',
  'RECONCILIATION',
  'DELIVERY',
  'RESTOCKING',
];

const RemoveDispenserModal: React.FC<RemoveDispenserProps> = ({ isModalOpen, setIsModalOpen }) => {

  return (
    <>
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center inset-0 bg-[#20212c72] dark:bg-[#20212cd9] z-50  opacity-100 transition-opacity duration-225 ease-in-out">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
            <h2 className="text-xl font-bold mb-4 text-center text-text-color">Change Role</h2>

            {/* Account ID (Phone Number) */}
            <Input
              type="text"
              placeholder="Account Number (Phone)"
              className=" border-gray-400 text-text-color"
            />

            {/* Role Selection */}
            <Select>
              <SelectTrigger className="w-full text-text-color my-3">
                <SelectValue className="text-xs " placeholder="Select customer type..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Merchant Code */}
            <Input
              type="text"
              placeholder="Merchant Code"
              className=" border-gray-400 text-text-color"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="default">
                RemoveDispenser
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RemoveDispenserModal;
