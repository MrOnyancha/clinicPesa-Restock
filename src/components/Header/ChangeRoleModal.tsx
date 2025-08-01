import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { WebService } from '@/web-services/WebService';

type ChangeRoleModalProps = {
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

const ChangeRoleModal: React.FC<ChangeRoleModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const [accountId, setAccountId] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('DISPENSER');
  const [requestId, setRequestId] = useState('');

  // Get requestId from localStorage
  useEffect(() => {
    const storedRequestId = localStorage.getItem('account_id');
    if (storedRequestId) {
      setRequestId(storedRequestId);
    }
  }, []);

  const handleChangeRole = async () => {
    if (!accountId || !requestId) {
      toast.error('Please enter both Account Number and ensure Request ID is set.');
      return;
    }

    if (!/^\d{9,13}$/.test(accountId)) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    const payload = {
      request: 'CHANGE_ROLE',
      accountNo: accountId,
      requestId,
      pharmacist: {
        role: selectedRole,
      },
    };

    try {
      const response = await WebService.postPharma('pharma', payload);

      const data = await response.json();

      if (data.status === false) {
        toast.error(`Error: ${data.message || 'Failed to change role'}`);
      } else {
        toast.success(`Role changed successfully: ${data.message}`);
        setIsModalOpen(false);
      }

      // Reset form
      setAccountId('');
      setSelectedRole('DISPENSER');
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center inset-0 bg-[#20212c72] dark:bg-[#20212cd9] z-50  opacity-100 transition-opacity duration-225 ease-in-out">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center text-text-color">
          Change Role
        </h2>

        {/* Account ID Input */}
        <Input
          type="text"
          placeholder="Account Number (Phone)"
          className="border-gray-400 text-text-color"
          value={accountId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccountId(e.target.value)}
        />

        {/* Role Selector */}
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full text-text-color my-3">
            <SelectValue placeholder="Select role..." />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-5">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button type="button" variant="default" onClick={handleChangeRole}>
            Change Role
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
