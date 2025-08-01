import StatsCard from "./StatsCard";
import { formatCurrency } from "@/utils/formatCurrency";
import { LineChart, AlertTriangle, ArrowUpRight } from "lucide-react";
interface Props {
  todaySales: {
    amount: number;
    date: string;
  };
  weekSales: number;
  monthSales: number;
  dashboardStats: {
    monthlyRevenue: number;
    orderCount: number;
    lowStockCount: number;
  };
}


const StatsSection = ({ todaySales, weekSales, monthSales, dashboardStats }: Props) => {
  const formatDateLabel = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = `'${date.getFullYear().toString().slice(-2)}`;
    return `${day} ${month} ${year}`;
  };

  return (
    <>
      <h4 className="font-medium dark:text-primary-light-900 py-4">Quick Stats Cards</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          label={`Sales on ${formatDateLabel(todaySales.date)}`}
          value={formatCurrency(todaySales.amount)}
          trend="neutral"
          change="N/A"
          icon={LineChart}
          iconColor="text-green-600"
          iconBgColor="bg-green-100 bg-opacity-40"
        />


        <StatsCard label="Sales Weekly" value={formatCurrency(weekSales)} trend="neutral" change="N/A" icon={LineChart} iconColor="text-green-600" iconBgColor="bg-green-100 bg-opacity-40" />
        <StatsCard label="Sales Monthly" value={formatCurrency(monthSales)} trend="neutral" change="N/A" icon={LineChart} iconColor="text-green-600" iconBgColor="bg-green-100 bg-opacity-40" />
        {/* <StatsCard label="Bill Summary" value={formatCurrency(dashboardStats.monthlyRevenue)} trend="up" change="+12%" icon={LineChart} iconColor="text-green-600" iconBgColor="bg-green-100 bg-opacity-40" /> */}
        {/* <StatsCard label="New Orders" value={dashboardStats.orderCount} trend="up" change="+8%" icon={ArrowUpRight} iconColor="text-blue-600" iconBgColor="bg-blue-100 bg-opacity-40" /> */}
        {/* <StatsCard label="Low Stock Items" value={dashboardStats.lowStockCount} trend="down" change="+5" icon={AlertTriangle} iconColor="text-amber-600" iconBgColor="bg-amber-100 bg-opacity-40" /> */}
      </div>
    </>
  );
};

export default StatsSection;
