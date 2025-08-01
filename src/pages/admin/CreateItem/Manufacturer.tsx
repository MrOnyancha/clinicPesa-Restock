import { useSearchItemsQuery } from '@/utils/useSearchItemsQuery';
import React, { useState } from 'react';

const Manufacturer = () => {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'manufacturer'>('name'); // State to determine search type ('name' or 'manufacturer')
  const [isFullNameDisabled, setIsFullNameDisabled] = useState(true); // State to disable/enable Full Name field

  const { mutate: searchItems } = useSearchItemsQuery(); // Assuming the hook we created earlier is imported here

  // Function to handle the form submission and trigger the search
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let searchQuery = name; // Default search is by name, if the user has entered a name.
    
    if (searchBy === 'manufacturer') {
      searchQuery = fullName; // If searching by manufacturer, use the full name field
    }

    // Log the search query before calling the API
    console.log('🔍 Search query:', searchQuery);
    console.log('Search filter type:', searchBy);

    // Trigger the search with the correct query and filter type
    searchItems({ query: searchQuery, filterType: searchBy });

    // Optionally reset the form fields after submitting
    setName('');
    setFullName('');
  };

  // Function to handle the search response and enable Full Name field if no result is found
  const handleSearchResult = (data: any) => {
    console.log('Search result:', data);
    if (!data.items || data.items.length === 0) {
      setIsFullNameDisabled(false); // Enable full name search if no result is found
    } else {
      setIsFullNameDisabled(true); // Keep full name disabled if results are found
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Manufacturer</h2>
        <p className="text-gray-600 text-center mb-6 text-justify">
          The manufacturer is the company that produces the item. This information is important for tracking the origin of the item and ensuring quality control.
        </p>

        {/* Manufacturer Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter item name"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter item full name"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isFullNameDisabled}
            />
          </div>

          <div className="flex justify-between items-center space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                // Reset form fields
                setName('');
                setFullName('');
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Manufacturer;
