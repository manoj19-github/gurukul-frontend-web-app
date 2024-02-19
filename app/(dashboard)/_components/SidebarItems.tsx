"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import React, { FC } from "react";

interface SidebarItemsProps {
  href: string;
  label: string;
  Icon: LucideIcon;
}

const SidebarItems: FC<SidebarItemsProps> = ({
  href,
  label,
  Icon,
}): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const isActiveRoute =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);
  const onClickHandler = () => {
    router.push(href);
  };
  return (
    <button
      type="button"
      onClick={onClickHandler}
      className={cn(
        `flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20`,
        isActiveRoute
          ? "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
          : ""
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActiveRoute ? "text-sky-700" : "")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActiveRoute ? "opacity-100" : ""
        )}
      />
    </button>
  );
};

export default SidebarItems;
