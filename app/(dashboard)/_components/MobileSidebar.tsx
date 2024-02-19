import React, { FC } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
interface MobileSidebarProps {}
const MobileSidebar: FC<MobileSidebarProps> = (): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-70 transition-all">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white" side="left">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
