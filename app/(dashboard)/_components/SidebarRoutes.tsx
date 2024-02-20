"use client";
import { guestRoutes, teacherRoutes } from "@/environments";
import React, { FC } from "react";
import SidebarItems from "./SidebarItems";
import { usePathname } from "next/navigation";

interface SidebarRoutesProps {}
const SidebarRoutes: FC<SidebarRoutesProps> = (): JSX.Element => {
  const pathname = usePathname();
  const isTeacherPage = pathname.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((routes, index) => (
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
