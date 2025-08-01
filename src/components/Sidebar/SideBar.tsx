import { useIsMediumScreen } from "@/hooks/useIsMediumScreen"; // adjust path as needed
import type { SidebarModulesInterface, SidebarProps } from "../types/sideBar";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { sidebarModules } from "@/routes/sideBarModules";
import { HiChevronLeft } from "react-icons/hi";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import SidebarModule from "./SidebarModule";

const Sidebar: React.FC<SidebarProps> = ({ openSidebar, setOpenSidebar }) => {
  const [items, setItems] = useState<SidebarModulesInterface[]>([]);
  const location = useLocation();
  const isMedium = useIsMediumScreen();


  useEffect(() => {
    const modules = sidebarModules();
    setItems(modules);
  }, []);

  const handleOpenSidebar = () => setOpenSidebar(!openSidebar);

  return (
    <aside
      className={`
    fixed md:sticky top-0 left-0
    h-screen
    w-64
    bg-white shadow-md overflow-y-auto z-40
    transform transition-transform duration-300 ease-in-out
    ${openSidebar ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0 md:h-screen md:flex-shrink-0
  `}
    >
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 border-b border-gray-200">
        <Link to="/dashboard" className="max-w-[140px] flex items-center h-auto">
          <img alt="logo" src="/images/logo.png" className="w-full" />
        </Link>

        {/* Toggle only on mobile */}
        <button
          onClick={handleOpenSidebar}
          className="md:hidden w-8 h-8 rounded-full shadow-md flex items-center justify-center hover:text-[#e50142] hover:border-2"
          aria-label="Toggle Sidebar"
        >
          {openSidebar ? <HiChevronLeft className="h-7" /> : <AiOutlineMenuUnfold className="h-7" />}
        </button>
      </div>

      {/* Menu Items */}
      <ul className={`mt-4 px-2`}>
        {items.map((item, index) => (
          <SidebarModule
            key={index}
            item={item}
            index={index}
            openSidebar={openSidebar}
            locationPath={location.pathname}
            closeSidebar={() => setOpenSidebar(false)} // ✅ Pass the close function
          />

        ))}
      </ul>
    </aside>

  );
};

export default Sidebar
