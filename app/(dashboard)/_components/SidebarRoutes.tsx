"use client";
import { guestRoutes } from "@/environments";
import React, { FC } from "react";
import SidebarItems from "./SidebarItems";

interface SidebarRoutesProps {}
const SidebarRoutes: FC<SidebarRoutesProps> = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full">
      {guestRoutes.map((routes, index) => (
        <SidebarItems
          key={index}
          Icon={routes.icon}
          label={routes.label}
          href={routes.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
