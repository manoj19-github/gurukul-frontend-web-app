"use client";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import React, { FC } from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface NavbarRoutesProps {}
const NavbarRoutes: FC<NavbarRoutesProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isTeacherMode = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapter");

  return (
    <div className="flex gap-x-2 ml-auto">
      {isPlayerPage || isTeacherMode ? (
        <Button>
          <LogOut className="h-4 w-4 mr-2" />
          Exit
        </Button>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant={"ghost"}>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default NavbarRoutes;
