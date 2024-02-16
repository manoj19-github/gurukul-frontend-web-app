import { UserButton } from "@clerk/nextjs";
import React, { FC } from "react";

interface DashboardPageProps {}
const DashboardPage: FC<DashboardPageProps> = (): JSX.Element => {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};

export default DashboardPage;
