"use client";
import { loginAction } from "@/actions/auth.action";
import useMounted from "@/hooks/useMounted";

import React, { startTransition } from "react";
import { useForm } from "react-hook-form";
const LoginForm = () => {
  const form = useForm();

  const onSubmit = async (values: any) => {
    console.log("values: ", values);
    const response = await loginAction({ ...values, userRole: "STUDENT" });
    console.log("response: ", response);
  };
  const mounted = useMounted();
  if (!mounted) return <></>;

  return (
    <div className="mt-5 border border-red-500">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <input type="text" {...form.register("email")} />
        <input type="password" {...form.register("password")} />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
