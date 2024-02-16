import React, { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}
const AuthLayout: FC<AuthLayoutProps> = ({ children }): JSX.Element => {
  return (
    <div className="flex h-full items-center justify-center lg:mt-16">
      {children}
    </div>
  );
};

export default AuthLayout;
