import { SignIn } from "@clerk/nextjs";
import React, { FC } from "react";

interface SigninPageProps {}
const SigninPage: FC<SigninPageProps> = (): JSX.Element => {
  return <SignIn />;
};

export default SigninPage;
