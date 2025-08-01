import React, { useState } from 'react';
import { toast } from 'sonner';
import { WebService } from '@/web-services/WebService';

const CreateWishList = () => {
  const [itemList, setItemList] = useState([
    { itemName: '', itemBrand: '', itemQuantity: '', unitofMeasure: '', itemStatus: '' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (index: number, field: string, value: string) => {
    const updatedList = [...itemList];
    updatedList[index][field as keyof typeof itemList[0]] = value;
    setItemList(updatedList);
  };

  const addItem = () => {
    setItemList([
      ...itemList,
      { itemName: '', itemBrand: '', itemQuantity: '', unitofMeasure: '', itemStatus: '' },
    ]);
  };

  const removeItem = (index: number) => {
    const updatedList = itemList.filter((_, i) => i !== index);
    setItemList(updatedList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  const site = localStorage.getItem('siteName') || '';
  const user = localStorage.getItem('firstName') || '';
    const payload = {
      action: 'CREATE_WISHLIST',
      site: site,
      dispenser: user,
      timeStamp: new Date().toISOString(),
      itemList,
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    setLoading(true);
    try {
      const response = await WebService.postPharma('wishlist', payload);

      if (response?.status) {
        toast.success('Wish list created successfully!');
        setItemList([{ itemName: '', itemBrand: '', itemQuantity: '', unitofMeasure: '', itemStatus: '' }]);
      } else {
        toast.error(response?.message || 'Failed to create wish list.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 border rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create Wish List</h1>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Item List */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Item List</h2>
          {itemList.map((item, index) => (
            <div key={index} className="border p-4 rounded-lg mb-6 shadow-sm bg-gray-50 dark:bg-gray-800 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Name</label>
                <input
                  type="text"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Item Brand</label>
                <input
                  type="text"
                  value={item.itemBrand}
                  onChange={(e) => handleItemChange(index, 'itemBrand', e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input
                  type="text"
                  value={item.itemQuantity}
                  onChange={(e) => handleItemChange(index, 'itemQuantity', e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Unit of Measure</label>
                <input
                  type="text"
                  value={item.unitofMeasure}
                  onChange={(e) => handleItemChange(index, 'unitofMeasure', e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  value={item.itemStatus}
                  onChange={(e) => handleItemChange(index, 'itemStatus', e.target.value)}
                  required
                  className="w-full mt-1 px-3 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                >
                  <option value="">Select status</option>
                  <option value="ON DEMAND">ON DEMAND</option>
                  <option value="NEW ON THE MARKET">NEW ON THE MARKET</option>
                  <option value="NEVER SUPPLIED">NEVER SUPPLIED</option>
                </select>
              </div>

              {itemList.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 text-sm underline hover:font-semibold"
                >
                  Remove Item
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Item
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  );
};

export default CreateWishList;

