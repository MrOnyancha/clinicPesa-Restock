import React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  label,
  value,
  change,
  trend,
  icon: Icon,
  iconColor,
  iconBgColor
}) => {
  
  return (
    <Card className="border border-neutral-100">
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium dark:text-primary-light-500">{label}</p>
            <h3 className="text-2xl font-bold mt-1 dark:text-primary-light">{value}</h3>
          </div>
          <div className={`p-2 ${iconBgColor} rounded-full`}>
            <Icon className={`${iconColor} h-5 w-5`} aria-hidden="true" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium flex items-center ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-neutral-500'
          }`}>
            {trend === 'up' ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            ) : null}
            {change}
          </span>
          <span className="tdark:text-primary-light-500 text-sm ml-2">vs. Yesterday</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
