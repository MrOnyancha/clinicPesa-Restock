import React, { useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { useCreateDispenser } from "../../utils/useCreateDispenser";
import { toast } from 'sonner';

const roles = [
  "DISPENSER",
  "SUPERVISOR",
  "ACCOUNTANT",
  "MANAGER",
  "IT",
  "ADMIN",
  "RECONCILIATION",
  "DELIVERY",
  "RESTOCKING",
];

interface DispenserModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const DispenserModal = ({ isModalOpen, setIsModalOpen }: DispenserModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [station, setStation] = useState("");
  const [role, setRole] = useState("");

  const { mutate: createDispenser, isPending } = useCreateDispenser();
  const normalizePhoneNumber = (input: string): string | null => {
    let digitsOnly = input.replace(/\D/g, ""); // remove non-digits

    if (digitsOnly.startsWith("07")) {
      digitsOnly = "256" + digitsOnly.slice(1); // 07xxxxxxxx → 2567xxxxxxx
    } else if (digitsOnly.startsWith("7")) {
      digitsOnly = "256" + digitsOnly; // 7xxxxxxxx → 2567xxxxxxx
    }

    // Match MTN Uganda prefixes: 76, 77, 78, 79
    const mtnPattern = /^256(76|77|78|79)\d{7}$/;

    return mtnPattern.test(digitsOnly) ? digitsOnly : null;
  };


  const handleCreate = () => {
    const accountNo = localStorage.getItem("account_id");
    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    if (!accountNo || !normalizedPhone || !role || !station) {
      return toast.warning("Please fill all required fields with a valid MTN number");
    }

    const payload = {
      request: "ADS_CREATE",
      accountNo,
      requestId: normalizedPhone,
      pharmacist: {
        ads: true,
        active: true,
        station: [station],
        role,
      },
    };

    createDispenser(payload, {
      onSuccess: () => {
        toast.success("Dispenser created successfully");
        setIsModalOpen(false);
        setPhoneNumber("");
        setRole("");
        setStation("");
      },
      onError: (err: any) => {
        toast.warning(`Failed to create dispenser: ${err.message}`);
        console.error(err);
      },
    });
  };


  if (!isModalOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center inset-0 bg-[#20212c72] dark:bg-[#20212cd9] z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center text-text-color">
          Create Dispenser
        </h2>

        <Select onValueChange={setRole}>
          <SelectTrigger className="w-full text-text-color mb-3">
            <SelectValue placeholder="Select Role..." />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border-gray-400 text-text-color"
        />

        <Input
          type="text"
          placeholder="Station Name"
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="my-3 border-gray-400 text-text-color"
        />

        <div className="flex justify-end gap-3 mt-5">
          <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleCreate}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DispenserModal;
