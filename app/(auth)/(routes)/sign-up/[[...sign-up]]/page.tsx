import { SignUp } from "@clerk/nextjs";
import React, { FC } from "react";

interface SignupPageProps {}
const SignupPage: FC<SignupPageProps> = (): JSX.Element => {
  return <SignUp />;
};

export default SignupPage;
