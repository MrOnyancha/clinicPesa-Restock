import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { WebService } from "@/web-services/WebService";
import { useFetchSites } from "@/utils/useFetchSites";
import StatsSection from "./StatsSection";
import SalesSummaryChart from "./SalesSummaryChart";
import DispenserSalesTable from "./DispenserSalesTable";
import type { DispenserSalesData, SalesData } from "@/components/types/sales";

const Dashboard = () => {
  const { mutate: fetchSites } = useFetchSites();

  const adsRole = localStorage.getItem("adsRole");
  const adsStation = localStorage.getItem("adsStation");
  const isDispenser = adsRole === "DISPENSER";

  // State to hold the currently selected site from the dropdown.
  // Initialize based on role: adsStation for dispenser, "ALL" for others.
  const [selectedSite, setSelectedSite] = useState<string>(
    isDispenser && adsStation ? adsStation : "ALL"
  );
  const [siteOptions, setSiteOptions] = useState<{ label: string; value: string }[]>([]);

  // Determine the actual siteId for the API call
  // If dispenser, use adsStation. Otherwise, use what's in selectedSite state.
  const salesSiteIdForApi = isDispenser ? adsStation || "ALL" : selectedSite;

  // Fetch site options for non-dispensers
  useEffect(() => {
    fetchSites(undefined, {
      onSuccess: (sites) => {
        const options = [
          { label: "All Sites", value: "ALL" },
          ...sites.map((site) => ({
            label: site.name,
            value: String(site.tillNo),
          })),
        ];
        setSiteOptions(options);

        // Store matching facility name based on adsStation
        const matchingSite = sites.find(site => String(site.tillNo) === adsStation);
        if (matchingSite) {
          localStorage.setItem("facilityName", matchingSite.name);
          console.log("[DEBUG] Saved facilityName:", matchingSite.name);
        } else {
          console.warn("[DEBUG] No matching site found for adsStation:", adsStation);
        }

        // Pre-select "ALL" for non-dispensers
        if (selectedSite === "ALL" && !isDispenser) {
          setSelectedSite("ALL");
        }
      },
      onError: () => toast.error("Failed to fetch sites"),
    });
  }, [adsStation, adsRole, isDispenser, fetchSites, selectedSite]);

  const {
    data: salesStats,
    isLoading,
    error,
    refetch: refetchSalesStats,
  } = useQuery<SalesData>({
    queryKey: ["salesStatistics", salesSiteIdForApi], // Use the derived salesSiteIdForApi as part of the query key
    queryFn: async () => {
      // The queryParams now directly use the determined salesSiteIdForApi
      const queryParams = { "requestType": "GET", params: { keys: ["siteId"], values: [salesSiteIdForApi] } };

      // console.log("[DEBUG] Fetching sales_statistics with params:", queryParams);

      try {
        const response = await WebService.postPharma("sales_statistics", queryParams);
        // console.log("[DEBUG] sales_statistics response:", response);
        return response;
      } catch (err) {
        console.error("[ERROR] sales_statistics API error:", err);
        throw err;
      }
    },
    // The query should only be enabled if we have a siteId to query for.
    // 'ALL' is a valid siteId in this context, as is a specific adsStation or selectedSite.
    enabled: !!salesSiteIdForApi, // Ensure salesSiteIdForApi is not empty/null before fetching
    refetchOnWindowFocus: false,
  });

  // Refetch when site selection changes (for non-dispensers) or adsStation changes (for dispensers)
  // This useEffect covers both scenarios implicitly because salesSiteIdForApi changes
  useEffect(() => {
    console.log("[DEBUG] salesSiteIdForApi changed to:", salesSiteIdForApi, "Refetching sales stats.");
    refetchSalesStats();
  }, [salesSiteIdForApi, refetchSalesStats]);


  const getApiDateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const getApiWeekKey = (d: Date) => {
    const year = d.getFullYear();
    const firstJan = new Date(year, 0, 1);
    const days = Math.floor((+d - +firstJan) / 86400000);
    const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
    return `${year}-W${String(week).padStart(2, '0')}`; // Ensure week is two digits for format "YYYY-WNN"
  };
  const getApiMonthKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}`;

  if (isLoading) return <div>Loading sales statistics...</div>;
  if (error) return <div>Error loading sales statistics. Check console.</div>;

  return (
    <section className="w-full p-4 border rounded shadow-md dark:border-slate-700 bg-white dark:bg-slate-900">
      {!isDispenser && ( // Only show dropdown if not a dispenser
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Select Site:</label>
          <select
            className="p-2 border rounded dark:bg-slate-800 dark:text-white"
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            {siteOptions.map((site) => (
              <option key={site.value} value={site.value}>
                {site.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <StatsSection
        todaySales={{
          amount: salesStats?.salesByDay?.[getApiDateKey(new Date())]?.amount || 0,
          date: getApiDateKey(new Date()),
        }}
        weekSales={salesStats?.salesByWeek?.[getApiWeekKey(new Date())]?.amount || 0}
        monthSales={salesStats?.salesByMonth?.[getApiMonthKey(new Date())]?.amount || 0}
        dashboardStats={{ monthlyRevenue: 0, orderCount: 0, lowStockCount: 0 }}
      />

      {salesStats?.salesByDay && (
        <div className="bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-slate-700 mt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div style={{ flex: 1, minWidth: 0 }}>
              <SalesSummaryChart title="Sales Summary Week" salesByDay={salesStats.salesByWeek} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <SalesSummaryChart title="Sales Summary Month" salesByDay={salesStats.salesByMonth} />
            </div>
          </div>
        </div>
      )}

      {/* Include your DispenserSalesTable if needed */}
      {/* {dispenserSalesData?.dispenserBreakdown && dispenserSalesData.dispenserBreakdown.length > 0 && (
        <DispenserSalesTable data={dispenserSalesData.dispenserBreakdown} />
      )} */}
    </section>
  );
};

export default Dashboard;