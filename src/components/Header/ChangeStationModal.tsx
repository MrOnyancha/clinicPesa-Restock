import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { WebService } from '@/web-services/WebService';


type ChangeStationModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChangeStationModal: React.FC<ChangeStationModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [accountId, setAccountId] = useState('');
  const [stationId, setStationId] = useState('');
  const [requestId, setRequestId] = useState('');

  // Fetch requestId from localStorage and accountId (phone number)
  useEffect(() => {
    const storedRequestId = localStorage.getItem('account_id'); // Retrieve account_id from localStorage
    if (storedRequestId) {
      setRequestId(storedRequestId); // Set the requestId
    }
  }, []); // This will run once when the component mounts

  const handleChangeRole = async () => {
    if (!accountId || !requestId) {
      toast.error('Please enter both Account ID (Phone) and Request ID');
      return;
    }

    const payload = {
      request: 'ADD_STATION',
      accountNo: accountId,
      requestId,
      pharmacist: {
        station: [stationId],
      },
    };

    try {
      const response = await WebService.postPharma('pharma', payload);

      const data = await response.json();
      // Check if the status is false
      if (data.status === false) {
        toast.error(`Error: ${data.message || 'Failed to create dispenser'}`);
        setAccountId('');
        setStationId('');
      } else if (data.status === true) {
        toast.success(`Role changed successfully!, ${data.message}`);
        setAccountId('');
        setStationId('');
        setIsModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error('Network error:', error);
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center inset-0 bg-[#20212c72] dark:bg-[#20212cd9] z-50  opacity-100 transition-opacity duration-225 ease-in-out">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center text-text-color">Change Station</h2>

        <Input
          type="text"
          placeholder="Account Number (Phone)"
          className=" border-gray-400 text-text-color"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Merchant Code"
          className=" border-gray-400 text-text-color my-3"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-5">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>

          <Button type="button" variant="default" onClick={handleChangeRole}>
            Change Station
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStationModal;
