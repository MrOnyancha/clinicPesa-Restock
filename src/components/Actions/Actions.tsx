import {  ActionsIntertface } from '@/utils/types';
import React, {  useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionProps {
  data: ActionsIntertface[];
}

const Actions: React.FC<ActionProps> = ({ data }) => {
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  // console.log(clickedAction);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 border dark:border-slate-700 rounded p-1 cursor-pointer transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-dark50 dark:text-white">
          Actions
          <span>
            <HiChevronDown />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {data?.map((action: ActionsIntertface, index) => {
          return (
            <React.Fragment key={index}>
              {action.children && action.children.length > 0 ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="font-normal">
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.name}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSeparator />
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {action.children.map((child, idx) => {
                        return (
                          <DropdownMenuItem onClick={() => setClickedAction(child.name)} key={idx}>
                            <child.icon className="h-4 w-4 mr-2" />
                            {child.name}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem onClick={() => setClickedAction(action.name)}>
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.name}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
    // <ul
    //   className={`transition-all absolute border-t shadow-md top-9 left-72  py-1 rounded-md bg-white duration-300 z-50`}

    // >
    //   {data.map((action, index) => {
    //     const actionId = `action_${index}`;

    //     return (
    //       <React.Fragment key={index}>
    //         <li
    //           onClick={() => {
    //             if (action?.children && action?.children?.length > 0) {
    //               setExpandedAction((prevId) => (prevId === actionId ? null : actionId));
    //             } else {
    //               onShowActions(false);
    //             }
    //           }}
    //           className={`text-sm py-2 ${action?.children && action?.children?.length > 0 ? 'flex justify-between items-center' : 'block'} w-full pr-2 cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300`}
    //         >
    //           <span className="flex items-center pr-7 pl-4 gap-2">
    //             {<action.icon size={20} />}
    //             {action.name}
    //           </span>
    //           {action.children ? <HiChevronRight /> : null}
    //         </li>
    //         {expandedAction === actionId && (
    //           <ul className="transition-all w-max flex flex-col justify-between border-t absolute left-[152px] shadow-md rounded-md bg-white duration-300 z-50">
    //             {action.children?.map((child: ActionChildren, childIndex: number) => {
    //               return (
    //                 <React.Fragment key={childIndex}>
    //                   <li
    //                     className={`text-sm py-2  pr-2 cursor-pointer hover:bg-primary hover:text-white transition-colors duration-300`}
    //                   >
    //                     <span className="flex items-center pr-6 pl-4 gap-2">
    //                       {<child.icon size={20} />}
    //                       {child.name}
    //                     </span>
    //                   </li>
    //                 </React.Fragment>
    //               );
    //             })}
    //           </ul>
    //         )}
    //       </React.Fragment>
    //     );
    //   })}
    // </ul>
  );
};

export default Actions;
