import { WebService } from "@/web-services/WebService";
import { useQuery } from "@tanstack/react-query";


export const useCheckOngoingShift = (enabled: boolean) => {
  const account_id = localStorage.getItem("account_id");
  const adsStation = localStorage.getItem("adsStation");
  const facilityName = localStorage.getItem("facilityName");

  return useQuery({
    queryKey: ["ongoingShift", account_id],
    queryFn: async () => {
      console.log("Fetching ongoing shift...");
      const payload = {
        request: "GET_SHIFT",
        shift: {
          pharmacy: {
            tillNo: adsStation,
            name: facilityName,
          },
          dispenser: {
            accountId: account_id,
          },
        },
        filterBy: "DISPENSER",
      };

      const response = await WebService.postPharma("pharma", payload);
      console.log("Ongoing shift response:", response);

      if (!response?.status || !Array.isArray(response.message)) {
        throw new Error("Invalid response for ongoing shift check");
      }

      const allShifts = response.message;

      // ✅ Only return shift if account_id and facility name both match
      const matchingShift = allShifts.find(
        (shift: any) =>
          String(shift?.dispenser?.accountId) === account_id &&
          String(shift?.pharmacy?.name) === facilityName &&
          shift.shiftStatus === "ONGOING"
      );

      return matchingShift ? [matchingShift] : [];
    },
    enabled: enabled && !!account_id && !!adsStation && !!facilityName,
    refetchOnWindowFocus: false,
  });
};


export const startShift = async () => {
  const adsStation = localStorage.getItem("adsStation");
  const siteName = localStorage.getItem("facilityName");
  const account_id = localStorage.getItem("account_id");
  const role = localStorage.getItem("adsRole");
  console.log("Starting shift with role:", role);

  if (role !== "DISPENSER") {
    throw new Error("Only dispensers can start a shift");
  }
  if (!adsStation || !siteName || !account_id) {
    throw new Error("Missing required shift details from localStorage");
  }

  const payload = {
    request: "START_SHIFT",
    role: "DISPENSER",
    accountNo: account_id,
    shift: {
      pharmacy: {
        tillNo: adsStation,
        name: siteName,
      },
      shift: "DAY",
    },
  };

  const response = await WebService.postPharma("pharma", payload);
  console.log("Start shift response:", response);
  const message = response?.message as unknown;

  // if (
  //   !response?.status ||
  //   !message ||
  //   typeof message !== "object" ||
  //   Array.isArray(message) ||
  //   !("shiftId" in message) ||
  //   !("timeStart" in message)
  // ) {
  //   throw new Error("Failed to start shift or invalid response format");
  // }

  const { shiftId, timeStart } = message as { shiftId: string; timeStart: number };

  return { shiftId, timeStart };
};

export const endShift = async () => {
  const shiftId = localStorage.getItem("shift_id");
  const accountId = localStorage.getItem("account_id");

  if (!shiftId || !accountId) {
    throw new Error("Missing shift ID or account ID in localStorage");
  }

  const payload = {
    request: "END_SHIFT",
    shift: {
      shiftId,
    },
    accountNo: accountId,
  };

  const response = await WebService.postPharma("pharma", payload);

  if (!response) {
    throw new Error("No response from server");
  }

  // ✅ Return the whole response, not just `message`
  return response;
};
