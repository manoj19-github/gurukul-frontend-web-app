import React, { FC } from "react";
import MobileSidebar from "./MobileSidebar";

interface NavbarProps {}
const Navbar: FC<NavbarProps> = (): JSX.Element => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
    </div>
  );
};

export default Navbar;
