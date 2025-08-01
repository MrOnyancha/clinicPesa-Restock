import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiChevronLeft } from 'react-icons/hi';
import SidebarSubModule from './SidebarSubModule';
import type { SidebarModulesInterface } from '../types/sideBar';

interface Props {
  item: SidebarModulesInterface;
  index: number;
  openSidebar: boolean;
  locationPath: string;
  closeSidebar: () => void; // ✅ Add this
}


const SidebarModule: React.FC<Props> = ({ item, index, openSidebar, locationPath, closeSidebar }) => {

  const [open, setOpen] = useState(false);

  if (item.hidden) return null; // ⛔ Skip rendering if this module is hidden for the current role

  const isActive = (path?: string) => path && locationPath === path;

  const handleClick = () => {
    if (item.modules.length > 0) setOpen(!open);
  };

  return (
    <li className={`w-full mb-1`}>
      {item.modules.length === 0 && item.path ? (
        // 🔗 Modules with a direct path and no submodules
        <Link
          to={item.path}
          onClick={() => {
            if (window.innerWidth < 768) {
              closeSidebar(); // ✅ Only close on mobile
            }
          }}
          className={`flex items-center px-4 py-2 ${openSidebar ? 'justify-start gap-2' : 'justify-center'} 
    ${isActive(item.path) ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}
    transition-colors duration-300 rounded-r-full`}
        >
          {item.icon && <item.icon className="h-4 w-4" />}
          {openSidebar && item.module_name}
        </Link>
      ) : (

        // 📂 Modules with submodules (toggle open)
        <>
          <div
            className={`flex items-center cursor-pointer px-4 py-2 ${openSidebar ? 'justify-between' : 'justify-center'}
            ${isActive(item.path) ? 'bg-primary text-white' : 'hover:bg-primary hover:text-white'}
            transition-colors duration-300 rounded-r-full`}
            onClick={handleClick}
          >
            <span className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {openSidebar && item.module_name}
            </span>
            {openSidebar && item.modules.length > 0 && (
              <HiChevronLeft className={`transition-transform ${open ? '-rotate-90' : ''}`} />
            )}
          </div>

          {/* Submodules */}
          {open && openSidebar && (
            <ul className="ml-6">
              {item.modules
                .filter((sub) => !sub.hidden)
                .map((sub, subIndex) => (
                  <SidebarSubModule
                    key={subIndex}
                    module={sub}
                    locationPath={locationPath}
                    closeSidebar={closeSidebar} // ✅ Must be passed
                  />

                ))}
            </ul>
          )}
        </>
      )}
    </li>
  );
};

export default SidebarModule;
