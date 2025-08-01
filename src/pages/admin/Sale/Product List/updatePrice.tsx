import React, { useState } from 'react';

type Props = {
  itemName: string;
  currentPrice: number;
  onClose: () => void;
  onSubmit: (payload: { request: string; itemName: string; salePrice: number }) => void;
};

const UpdatePriceModal: React.FC<Props> = ({ itemName, currentPrice, onClose, onSubmit }) => {
  const [salePrice, setSalePrice] = useState(currentPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      request: 'UPDATE_PRICE',
      itemName,
      salePrice,
    });
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Update Sale Price</h2>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1">Item Name</label>
          <div className="bg-gray-100 p-2 rounded text-sm">{itemName}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
              New Sale Price (UGX)
            </label>
            <input
              id="salePrice"
              type="number"
              className="w-full border rounded px-3 py-2 text-sm"
              value={salePrice}
              onChange={(e) => setSalePrice(parseFloat(e.target.value))}
              required
              min={0}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1.5 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-300 hover:bg-gray-100 text-white px-4 py-1.5 rounded"
              onClick={(e) => {
                e.preventDefault();
                if (salePrice <= 0) {
                  alert('Sale price must be greater than zero.');
                  return;
                }
                handleSubmit(e);
              }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePriceModal;

