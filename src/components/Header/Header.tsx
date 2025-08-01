import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import ShiftToggle from "./ShiftToggle";
import UserProfileDropdown from "./UserProfileDropdown";
import ChangeRoleModal from "./ChangeRoleModal";
import ChangeStationModal from "./ChangeStationModal";
import RemoveDispenserModal from "./RemoveDispenser";
import DispenserModal from "./DispenserModal";
import RecordShiftSales from "./RecordShiftSales";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [isChangeStationModalOpen, setIsChangeStationModalOpen] = useState(false);
  const [isRemoveDispenserModalOpen, setIsRemoveDispenserModalOpen] = useState(false);
  const role = localStorage.getItem("adsRole");
  const [isRecordShiftSalesModalOpen, setIsRecordShiftSalesModalOpen] = useState(false);
  const [shiftSaleId, setShiftSaleId] = useState<string | null>(null);
  return (
    <header className="sticky top-0 bg-white shadow-sm z-20">
      <div className="flex justify-between items-center py-3 px-4">
        {/* Left: Menu Toggle & Breadcrumbs */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="h-5 w-4" />
          </Button>
        </div>

        {/* Center: Shift Toggle */}
        <div className="hidden md:block">
          <ShiftToggle
            role={role}
            onShiftEnded={(saleId) => {
              setShiftSaleId(saleId);
              setIsRecordShiftSalesModalOpen(true);
            }}
          />
        </div>

        {/* Right: User Profile & Notifications */}
        <div className="flex items-center space-x-2 overflow-hidden">
          {/* Shift Toggle (Mobile) */}
          <div className="md:hidden">
            <ShiftToggle
              onShiftEnded={(saleId) => {
                console.log("saleId received:", saleId);
                if (saleId) {
                  setShiftSaleId(saleId);
                  setIsRecordShiftSalesModalOpen(true); // ✅ will now only happen with real sales
                }
              }}
            />

          </div>
          {/* Notification Bell */}
          <UserProfileDropdown
            setIsCreateDispenserModalOpen={setIsModalOpen}
            setIsChangeRoleModalOpen={setIsChangeRoleModalOpen}
            setIsChangeStationModalOpen={setIsChangeStationModalOpen}
            setIsRemoveDispenserModalOpen={setIsRemoveDispenserModalOpen}
          />
        </div>
      </div>
      {isChangeRoleModalOpen && (
        <ChangeRoleModal isModalOpen={isChangeRoleModalOpen} setIsModalOpen={setIsChangeRoleModalOpen} />
      )}
      {isChangeStationModalOpen && (
        <ChangeStationModal isModalOpen={isChangeStationModalOpen} setIsModalOpen={setIsChangeStationModalOpen} />
      )}
      {isRemoveDispenserModalOpen && (
        <RemoveDispenserModal
          isModalOpen={isRemoveDispenserModalOpen}
          setIsModalOpen={setIsRemoveDispenserModalOpen}
        />
      )}
      <DispenserModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      <RecordShiftSales
        isOpen={isRecordShiftSalesModalOpen}
        onClose={() => setIsRecordShiftSalesModalOpen(false)}
        saleId={shiftSaleId}
      />

    </header>
  );
};

export default Header;
