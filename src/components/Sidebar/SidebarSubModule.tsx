import React from 'react';
import { Link } from 'react-router-dom';
import type { SubModule } from '../types/sideBar';

interface Props {
  module: SubModule;
  locationPath: string;
  closeSidebar: () => void; // ✅ Add this
}


const SidebarSubModule: React.FC<Props> = ({ module, locationPath, closeSidebar }) => {

  if (module.hidden) return null; // ❗ Respect the `hidden` flag

  const isActive = (path?: string) => path && locationPath === path;

  if (module.child && module.child.length > 0) {
    return (
      <ul className="ml-4">
        {module.child
          .filter(child => !child.hidden)
          .map((child, index) => (
            <li key={index}>
              {child.offsprings && child.offsprings.length > 0 ? (
                <ul className="ml-4">
                  <p className="text-xs font-bold my-1">{child.text}</p>
                  {child.offsprings
                    .filter(off => !off.hidden)
                    .map((off, idx) => (
                      <li
                        key={idx}
                        className={`pl-2 my-0.5 rounded transition-colors duration-300 ${isActive(off.path) ? 'bg-primary text-white' : 'hover:bg-gray-200'
                          }`}
                      >
                        <Link
                          to={off.path}
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              closeSidebar(); // ✅ Close on mobile
                            }
                          }}
                        >
                          {off.text}
                        </Link>

                      </li>
                    ))}
                </ul>
              ) : (
                <Link
                  className={`block pl-2 py-1 rounded transition-colors duration-300 ${isActive(child.path) ? 'bg-primary text-white' : 'hover:bg-gray-100'
                    }`}
                  to={child.path || '#'}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      closeSidebar(); // ✅ Close on mobile
                    }
                  }}
                >
                  {child.text}
                </Link>

              )}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <li className={`pl-2 py-1 rounded ${isActive(module.path) ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}>
      <Link
        to={module.path || '#'}
        className="block"
        onClick={() => {
          if (window.innerWidth < 768) {
            closeSidebar(); // ✅ Close on mobile
          }
        }}
      >
        {module.icon && <module.icon className="inline-block mr-1 w-4 h-4" />}
        {module.text}
      </Link>

    </li>
  );
};

export default SidebarSubModule;
