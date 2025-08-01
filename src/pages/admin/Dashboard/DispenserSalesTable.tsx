import React from "react";
import type { Props } from "@/components/types/sales";

const DispenserSalesTable: React.FC<Props> = ({ data }) => {
    const allWeeks = Array.from(
        new Set(data.flatMap((d) => Object.keys(d.salesByWeek || {})))
    ).sort();

    const allMonths = Array.from(
        new Set(data.flatMap((d) => Object.keys(d.salesByMonth || {})))
    ).sort();

    const todayDate = new Date();
    const today = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;


    return (
        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded shadow-md mb-6">
            <div className="border-b border-neutral-100 my-2 px-4 py-2 bg-[#0c8599]">
                  <div className="flex  sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="text-white text-base sm:text-lg font-semibold">
                       Dispenser Sales Table
                    </div>
                  </div>
                </div>
            <table className="min-w-full text-sm text-center">
                <thead className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                    <tr>
                        <th rowSpan={2} className="px-4 py-3">Dispenser</th>
                        <th rowSpan={2} className="px-4 py-3">Account ID</th>
                        <th rowSpan={2} className="px-4 py-3">Site</th>
                        <th rowSpan={2} className="px-4 py-3">Total Sales</th>
                        <th rowSpan={2} className="px-4 py-3">Total Amount</th>
                        <th rowSpan={2} className="px-4 py-3">
                            salesByDay
                        </th>
                        <th colSpan={allWeeks.length} className="px-4 py-3">Sales By Week</th>
                        <th colSpan={allMonths.length} className="px-4 py-3">Sales By Month</th>
                    </tr>
                    <tr>
                        {allWeeks.map((week) => (
                            <th key={week} className="px-4 py-3">
                                <div className="border border-gray-300 rounded px-2 py-1 mx-1">{week}</div>
                            </th>
                        ))}
                        {allMonths.map((month) => (
                            <th key={month} className="px-4 py-3">
                                <div className="border border-gray-300 rounded px-2 py-1 mx-1">{month}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                    {data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                            <td className="px-4 py-3">{item.name}</td>
                            <td className="px-4 py-3">{item.accountId}</td>
                            <td className="px-4 py-3">{item.siteName}</td>
                            <td className="px-4 py-3">{item.totalSales}</td>
                            <td className="px-4 py-3">{item.totalSalesAmount.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                                {item.salesByDay?.[today] ? (
                                    <>
                                        <div>{item.salesByDay[today].amount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-500">{item.salesByDay[today].count ?? "-"}</div>
                                    </>
                                ) : "-"}
                            </td>

                            {/* Sales By Week */}
                            {allWeeks.map((week) => {
                                const weekData = item.salesByWeek?.[week];
                                return (
                                    <td key={week} className="px-4 py-3">
                                        {weekData ? (
                                            <>
                                                <div className="flex justify-center items-center gap-4 border border-gray-300 rounded p-2">
                                                    <span>Amount</span>
                                                    <span className="border-l border-gray-300 pl-4 ml-4">{weekData.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center gap-3 border border-gray-300 rounded p-2">
                                                    <span className="pl-8">Total Sales</span>
                                                    <span className="border-l border-gray-300 pl-4 ml-4">
                                                        {weekData.count ?? "-"}
                                                    </span>
                                                </div>
                                            </>
                                        ) : "-"}
                                    </td>
                                );
                            })}

                            {/* Sales By Month */}
                            {allMonths.map((month) => {
                                const monthData = item.salesByMonth?.[month];
                                return (
                                    <td key={month} className="px-4 py-3">
                                        {monthData ? (
                                            <div className="border border-gray-300 rounded p-2 flex flex-col text-center">
                                                <div className="flex justify-center items-center gap-2 pb-1">
                                                    <span>Amount</span>
                                                    <span className="border-l border-gray-300 pl-2 ml-2">{monthData.amount.toLocaleString()}</span>
                                                </div>
                                                <div className="border-t border-gray-300 mt-1 pt-1 flex justify-center items-center gap-2">
                                                    <span>Total Sales</span>
                                                    <span className="border-l border-gray-300 pl-2 ml-2">{monthData.count ?? "-"}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DispenserSalesTable;
