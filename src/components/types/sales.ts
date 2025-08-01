export interface DispenserSale {
  accountId: string;
  name: string;
  siteId: string;
  siteName: string;
  totalSalesAmount: number;
  totalSales: number;
};

export interface DispenserSalesData {
  salesByMonth?: Record<string, { amount: number }>;
  salesByWeek?: Record<string, { amount: number }>;
  salesByDay?: Record<string, { amount: number }>;
  dispenserBreakdown?: DispenserSale[];
};

export interface DynamicSales {
    amount: number;
    count?: number;
};

export interface DispenserSale {
    accountId: string;
    name: string;
    siteId: string;
    siteName: string;
    totalSalesAmount: number;
    totalSales: number;
    salesByMonth?: Record<string, DynamicSales>;
    salesByWeek?: Record<string, DynamicSales>;
    salesByDay?: Record<string, DynamicSales>;
};

export interface Props {
    data: DispenserSale[];
};

// /types/sales.ts

export interface SalesData {
  dispenserBreakdown: any;
  year: number;
  totalSalesAmount: number;
  totalSales: number;
  salesGrowthPercentage: number;
  salesByMonth: Record<string, { amount: number; count: number }>;
  salesByWeek: Record<string, { amount: number; count: number }>;
  salesByDay: Record<string, { amount: number; count: number }>;
  billSummary: {
    totalBillAmount: number;
    totalBills: number;
    billGrowthPercentage: number;
    billsByMonth: Record<string, number>;
    billsByWeek: Record<string, number>;
    billsByDay: Record<string, number>;
  };
}
