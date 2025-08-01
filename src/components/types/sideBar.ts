import type { IconType } from "react-icons";

export interface SidebarProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
};

export interface SidebarSubModule {
  module: SubModule;
  locationPath: string;
};

export type SubChildren = {
  text: string;
  path: string;
  element: React.FC<any>;
  hidden?: boolean;
};

export type Child = {
  text: string;
  path?: string;
  element?: React.FC<any>;
  offsprings?: SubChildren[];
  hidden?: boolean;
};

export type SubModule = {
  text: string;
  path?: string;
  icon?: IconType;
  child?: Child[];
  element?: React.FC<any>;
  hidden?: boolean;
};

export type SidebarModulesInterface = {
  module_name: string;
  icon: IconType;
  path?: string;
  element?: React.FC<any>;
  modules: SubModule[];
  hidden?: boolean;
};

export type HiddenRoutesType = {
  name: string;
  path: string;
  element: React.FC<any>;
};

export type RouteConfig = {
  path: string;
  element: React.FC<any>;
  hidden?: boolean;
};
