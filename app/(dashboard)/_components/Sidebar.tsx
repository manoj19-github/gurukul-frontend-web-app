import React, { FC } from "react";
import Logo from "./Logo";
import SidebarRoutes from "./SidebarRoutes";

interface SidebarProps {}
const Sidebar: FC<SidebarProps> = (): JSX.Element => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="">
        <Logo />
      </div>
      <div className="flex flex-col w-full mt-10">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
