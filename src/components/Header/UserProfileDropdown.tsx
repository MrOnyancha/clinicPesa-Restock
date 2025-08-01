import { IoPersonOutline } from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

const UserProfileDropdown: React.FC<{
  setIsCreateDispenserModalOpen: (value: boolean) => void;
  setIsChangeRoleModalOpen: (value: boolean) => void;
  setIsChangeStationModalOpen: (value: boolean) => void; // Correct prop
  setIsRemoveDispenserModalOpen: (value: boolean) => void;

}> = ({
  setIsCreateDispenserModalOpen,
  setIsChangeRoleModalOpen,
  setIsChangeStationModalOpen, // Make sure this is received
  setIsRemoveDispenserModalOpen,

}) => {
  const firstName = localStorage.getItem('firstName') || '';
  const lastName = localStorage.getItem('lastName') || '';
  const adsRole = localStorage.getItem('adsRole') || '';
  // const adsRole = localStorage.getItem('adsRole');
  const dispenser = adsRole === 'DISPENSER';
  // const adsFirstName = localStorage.getItem('firstName');
  // const adsLastName = localStorage.getItem('lastName');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    toast("Logged out successfully");
    navigate("/auth/login");
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="py-1 mr-2 flex items-center gap-1 border rounded-md hover:bg-primary hover:text-white transition-colors duration-300 w-auto"
          >
            <IoPersonOutline className="text-lg" />
            <div className="text-left text-sm leading-tight">
              {firstName || lastName ? (
                <>
                  <p className="m-0">{firstName ?? ''}</p>
                  <p className="m-0">{lastName ?? ''}</p>
                </>
              ) : (
                <p className="m-0">Guest</p>
              )}
            </div>
            <HiChevronDown className="text-lg" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!dispenser && (
            <>
              <DropdownMenuItem onClick={() => setIsCreateDispenserModalOpen(true)}>Create Dispenser</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsChangeRoleModalOpen(true)}>Change Role</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsChangeStationModalOpen(true)}>Change Station</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRemoveDispenserModalOpen(true)}>Remove Dispenser</DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserProfileDropdown;
