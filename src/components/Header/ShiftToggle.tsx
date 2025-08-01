import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { endShift, startShift, useCheckOngoingShift } from "@/utils/useFetchShift"; // your query hook here
import { toast } from 'sonner'
interface ShiftToggleProps {
  className?: string;
  role?: string | null;
  onShiftEnded?: (saleId: string | null) => void; // ✅ Add this
}


type EndShiftResponse = {
  status: boolean;
  message: string | any[];
  shift?: {
    timeStart: number;
    timeStop: number;
  };
  sales?: {
    saleId?: string;
    [key: string]: any; // allow other fields just in case
  };
};

const ShiftToggle: React.FC<ShiftToggleProps> = ({ className, role, onShiftEnded }) => {
  const [isOnShift, setIsOnShift] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  const [isRecordShiftSalesModalOpen, setIsRecordShiftSalesModalOpen] = useState(false);
  // Query to check if ongoing shift exists (only run if role = DISPENSER)
  const { data, isLoading, isError } = useCheckOngoingShift(true);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      const ongoingShift = data.find((shift: any) => shift.shiftStatus === "ONGOING");

      if (ongoingShift) {
        localStorage.setItem("shift_id", ongoingShift.shiftId)
        setIsOnShift(true);
        setShiftStartTime(new Date(ongoingShift.timeStart));
      } else {
        setIsOnShift(false);
        setShiftStartTime(null);
      }
    }
  }, [data]);


  const handleToggleShift = async () => {
    const newShiftStatus = !isOnShift;
    setIsOnShift(newShiftStatus);

    if (!isOnShift) {
      try {
        const { shiftId, timeStart } = await startShift();
        const startDate = new Date(timeStart);

        setIsOnShift(true);
        setShiftStartTime(startDate);
        localStorage.setItem("shift_id", shiftId);

        toast.success(`Started at ${startDate.toLocaleTimeString()}`);
      } catch (error: any) {
        console.error(error);
        toast.warning(error.message || "Please try again.");
      }
    } else {
      try {
        const response = await endShift() as EndShiftResponse;
        const { status, message } = response;

        const isArray = Array.isArray(message);
        const isString = typeof message === "string";
        const isSuccess = status === true;

        // Only show modal if message is an array (regardless of contents)
        const shouldShowModal = isSuccess && isArray;

        // If message is an array and has sales, pick the first saleId
        const salesShiftId = isArray && message.length > 0 ? message[0] : null;

        if (isSuccess) {
          toast.success("Shift ended.");

          if (shouldShowModal) {
            onShiftEnded?.(salesShiftId); // Trigger modal
          }

          setIsOnShift(false);
          setShiftStartTime(null);
          localStorage.removeItem("shift_id");
        } else {
          toast.warning(isString ? message : "Please try again.");
        }
      } catch (error: any) {
        toast.warning(error.message || "Please try again.");
      }
    }
  };

  if (isLoading) return <p>Loading shift info...</p>;
  if (isError) return <p>Failed to load shift info</p>;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={isOnShift ? "destructive" : "default"}
        size="sm"
        onClick={handleToggleShift}
        className="flex items-center gap-1"
      >
        {isOnShift ? (
          <>
            <Pause className="h-4 w-2" />
            <span>End Shift</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-2" />
            <span>Start Shift</span>
          </>
        )}
      </Button>

      {isOnShift && shiftStartTime && (
        <div className="text-xs text-green-600 whitespace-nowrap">
          Started at <br /> {shiftStartTime.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default ShiftToggle;
