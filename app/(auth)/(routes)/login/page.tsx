import React, { FC } from "react";
import LoginForm from "./LoginForm";

interface LoginPageProps {}
const LoginPage: FC<LoginPageProps> = (): JSX.Element => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
