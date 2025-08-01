import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrencyShort } from "./formatCurrencyShort";

interface Props {
  title: string;
  salesByDay: Record<string, { amount: number; count: number }>;
}

const getWeekOfMonth = (date: Date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const offset = (firstDay.getDay() + 6) % 7;
  return Math.floor((date.getDate() + offset - 1) / 7) + 1;
};

const ordinalSuffix = (n: number) =>
  ["1st", "2nd", "3rd"][n - 1] || `${n}th`;

const formatWeekLabel = (weekStr: string) => {
  const [year, week] = weekStr.split("-W").map(Number);
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay();
  const ISOweekStart = new Date(simple);
  if (day <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }

  const weekOfMonth = getWeekOfMonth(ISOweekStart);
  const monthShort = ISOweekStart.toLocaleString("default", { month: "short" });
  const shortYear = `'${ISOweekStart.getFullYear().toString().slice(-2)}`;
  return `${ordinalSuffix(weekOfMonth)} W ${monthShort} ${shortYear}`;
};

const SalesSummaryChart = ({ salesByDay, title }: Props) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filter only current month data
  const currentMonthData = Object.entries(salesByDay)
    .map(([weekStr, { amount }]) => {
      const [year, week] = weekStr.split("-W").map(Number);
      const weekDate = new Date(year, 0, 1 + (week - 1) * 7);
      const day = weekDate.getDay();
      const monday = new Date(weekDate);
      if (day <= 4) {
        monday.setDate(weekDate.getDate() - weekDate.getDay() + 1);
      } else {
        monday.setDate(weekDate.getDate() + 8 - weekDate.getDay());
      }

      return {
        date: weekStr,
        amount,
        month: monday.getMonth(),
        year: monday.getFullYear(),
      };
    })
    .filter(({ month, year }) => month === currentMonth && year === currentYear)
    .sort((a, b) => {
      const [yearA, weekA] = a.date.split("-W").map(Number);
      const [yearB, weekB] = b.date.split("-W").map(Number);
      return yearA === yearB ? weekA - weekB : yearA - yearB;
    });

  const chartMonthLabel = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-slate-700 mt-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
        {title} – {chartMonthLabel}
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={currentMonthData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatWeekLabel} />
          <YAxis tickFormatter={(value) => formatCurrencyShort(value)} />
          <Tooltip formatter={(value: number) => formatCurrencyShort(value)} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      {currentMonthData.length === 0 && (
        <p className="text-center text-gray-400 mt-4">No sales data for this month.</p>
      )}
    </div>
  );
};

export default SalesSummaryChart;
