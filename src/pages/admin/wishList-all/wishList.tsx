import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postQBXMLData } from '@/services/httphandler';
import { WebService } from '@/web-services/WebService';

const WishList = () => {
    const [wishList, setWishList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [wishStatus, setWishStatus] = useState<'OPEN' | 'CLOSE'>('OPEN');
    const site = localStorage.getItem('facility') || '';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = { action: 'GET_WISHLIST', site, wishStatus };
                const res = await WebService.postPharma('wishlist', data);
                if (res?.message) setWishList(res.message);
                else setError('Failed to fetch wish list data.');
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [site, wishStatus]);

    if (loading) return <section className="p-2 m-2 border rounded shadow-md">Loading...</section>;
    if (error) return <section className="p-2 m-2 border rounded shadow-md">Error: {error}</section>;

    const handleWishStatusChange = (index: number, newStatus: string) => {
        setWishList(prev => {
            const updated = [...prev];
            updated[index].wishStatus = newStatus;

            console.log(`Wish status updated for dispenser ${updated[index].dispenser}:`, newStatus);

            return updated;
        });
    };


    return (
        <section className="p-2 m-2 border rounded shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h1 className="text-xl sm:text-2xl font-bold">Wish List</h1>
                <div className="flex gap-2 mt-2 sm:mt-0">
                    {/* <select
                        value={wishStatus}
                        onChange={(e) => setWishStatus(e.target.value as 'OPEN' | 'CLOSE')}
                        className="px-2 py-1 border rounded-md text-sm"
                    >
                        <option value="OPEN">Open</option>
                        <option value="CLOSE">Closed</option>
                    </select> */}
                    <Link
                        to="/create-wishlist"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                    >
                        Create Wishlist
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="hidden sm:table-header-group">
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border">Site</th>
                            <th className="py-2 px-4 border">Dispenser</th>
                            <th className="py-2 px-4 border">Wish Status</th>
                            <th className="py-2 px-4 border">Item List</th>
                        </tr>
                    </thead>

                    <tbody className="sm:table-row-group">
                        {wishList.map((item, i) => (
                            <React.Fragment key={i}>
                                {/* Desktop row */}
                                <tr className="hidden sm:table-row odd:bg-white even:bg-gray-50">
                                    <td className="py-2 px-4 border">{item.site}</td>
                                    <td className="py-2 px-4 border">{item.dispenser}</td>
                                    <td className="py-2 px-4 border">
                                        <select
                                            className="border rounded px-2 py-1 text-sm"
                                            value={item.wishStatus}
                                            onChange={(e) => handleWishStatusChange(i, e.target.value)}
                                        >
                                            <option value="OPEN">OPEN</option>
                                            <option value="CLOSE">CLOSE</option>
                                        </select>
                                    </td>

                                    <td className="py-2 px-4 border">
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[400px] border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="px-2 py-1 border text-xs">Item</th>
                                                        <th className="px-2 py-1 border text-xs">Brand</th>
                                                        <th className="px-2 py-1 border text-xs">Qty</th>
                                                        <th className="px-2 py-1 border text-xs">UoM</th>
                                                        <th className="px-2 py-1 border text-xs">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.itemList?.map((d, di) => (
                                                        <tr key={di} className="odd:bg-white even:bg-gray-50">
                                                            <td className="px-2 py-1 border text-xs">{d.itemName}</td>
                                                            <td className="px-2 py-1 border text-xs">{d.itemBrand}</td>
                                                            <td className="px-2 py-1 border text-xs">{d.itemQuantity}</td>
                                                            <td className="px-2 py-1 border text-xs">{d.unitofMeasure}</td>
                                                            <td className="px-2 py-1 border text-xs">{d.itemStatus}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </td>
                                </tr>

                                {/* Mobile card */}
                                <tr className="sm:hidden">
                                    <td colSpan={4} className="p-4 border-b">
                                        <div className="flex flex-col space-y-2">
                                            <div>
                                                <span className="font-semibold">Site:</span> {item.site}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Dispenser:</span> {item.dispenser}
                                            </div>
                                            <div>
                                                <span className="font-semibold">Wish Status:</span>
                                                <select
                                                    className="border rounded px-2 py-1 text-sm"
                                                    value={item.wishStatus}
                                                    onChange={(e) => handleWishStatusChange(i, e.target.value)}
                                                >
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="CLOSE">CLOSE</option>
                                                </select>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[300px] border-collapse">
                                                    <thead>
                                                        <tr className="bg-gray-100">
                                                            <th className="px-2 py-1 border text-xs">Item</th>
                                                            <th className="px-2 py-1 border text-xs">Brand</th>
                                                            <th className="px-2 py-1 border text-xs">Qty</th>
                                                            <th className="px-2 py-1 border text-xs">UoM</th>
                                                            <th className="px-2 py-1 border text-xs">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {item.itemList?.map((d, di) => (
                                                            <tr key={di} className="odd:bg-white even:bg-gray-50">
                                                                <td className="px-2 py-1 border text-xs">{d.itemName}</td>
                                                                <td className="px-2 py-1 border text-xs">{d.itemBrand}</td>
                                                                <td className="px-2 py-1 border text-xs">{d.itemQuantity}</td>
                                                                <td className="px-2 py-1 border text-xs">{d.unitofMeasure}</td>
                                                                <td className="px-2 py-1 border text-xs">{d.itemStatus}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default WishList;
