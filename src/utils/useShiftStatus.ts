import { useQuery } from "@tanstack/react-query";

interface ShiftStatus {
  active: boolean;
  startTime: string | null;
  shiftId: string | null;
}

export const useShiftStatus = () => {
  return useQuery<ShiftStatus>({
    queryKey: ['shiftStatus'],
    queryFn: async () => {
      const shiftData = localStorage.getItem('shift_id');
      if (shiftData) {
        return JSON.parse(shiftData);
      }
      return { active: false, startTime: null, shiftId: null };
    },
    staleTime: Infinity,
  });
};
