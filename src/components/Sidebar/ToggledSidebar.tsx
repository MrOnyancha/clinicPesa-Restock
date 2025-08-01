import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  //   DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import type { SidebarModulesInterface, SubModule } from '../../routes/sideBarModules';

interface ToggledSidebarProps {
  data: SidebarModulesInterface;
  index: number;
}

const ToggledSidebar: React.FC<ToggledSidebarProps> = ({ data, index }) => {
  const [clickedIconIndex, setClickedIconIndex] = useState<number | null>(null);

  const location = useLocation();

  const handleClickIcon = (index: number | null) => {
    setClickedIconIndex(clickedIconIndex === index ? null : index);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={() => handleClickIcon(index)}
          className={`flex items-center justify-center w-full h-10  border-r border-neutral-200 dark:border-slate-700 cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300 mb-1 ${clickedIconIndex === index ? 'bg-primary text-white' : ''}`}
        >
          <span>{data.icon && <data.icon size={20} />}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="text-center">{data.module_name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {data.modules.filter((module: SubModule) => !module.hidden).map((module, modIndex) => {
            return (
              <React.Fragment key={modIndex}>
                {module.child && module.child.length > 0 ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="dark:hover:bg-dark100 dark:hover:text-primary">
                      <span>{module.text}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {module.child.filter(childItem => !childItem.hidden).map((childItem, childIndex) => {
                          return (
                            <React.Fragment key={childIndex}>
                              {childItem.offsprings && childItem.offsprings.length > 0 ? (
                                <Accordion type="single" collapsible>
                                  <AccordionItem value={childItem.text}>
                                    <AccordionTrigger className="py-2 link-class pr-2 pl-3 dark:hover:bg-dark100 dark:hover:text-primary">
                                      {childItem.text}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                      <ul className="pb-2 ml-3 border dark:border-slate-700 rounded mt-1 transition-all duration-600 shadow-md mr-2">
                                        {childItem.offsprings.filter(offspring => !offspring.hidden).map((offspring) => {
                                          return (
                                            <li
                                              key={offspring.text}
                                              className={` py-1 pr-1 pl-2 mr-1 mt-2 cursor-pointer  link-class ${isActive(offspring.path || '') ? 'bg-primary text-white' : ''}`}
                                            >
                                              <Link to={offspring.path} className={`w-full block h-full`}>
                                                {offspring.text}
                                              </Link>
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    </AccordionContent>
                                  </AccordionItem>
                                </Accordion>
                              ) : (
                                <Link to={childItem.path || ''}>
                                  <DropdownMenuItem>
                                    <span className="dark:hover:bg-dark100 dark:hover:text-primary">
                                      {childItem.text}
                                    </span>
                                  </DropdownMenuItem>
                                </Link>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <Link to={module.path || ''}>
                    <DropdownMenuItem>
                      <p className="flex items-center gap-1 dark:hover:bg-dark100 dark:hover:text-primary">
                        <span>{module.icon && <module.icon className="h-4 w-4" />}</span>
                        <span>{module.text}</span>
                      </p>
                    </DropdownMenuItem>
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </React.Fragment>
  );
};

export default ToggledSidebar;
