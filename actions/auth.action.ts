"use server";
import { signIn } from "@/auth";
import { LoginSchema } from "../app/schema/auth.schema";
import * as Z from "zod";
import { BASEURL, DEFAULT_LOGIN_REDIRECT, SUBURLS } from "../environments";
import { AuthError } from "next-auth";
import { IUserRole } from "@/interfaces/user.interface";
import { cookies } from "next/headers";
export const loginAction = async (
  values: any
): Promise<{ message: string; status: boolean }> => {
  try {
    console.log("hit sign12121");
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success)
      return { message: "invalid  fields", status: false };
    const existingUser = await getUserByEmail(
      values.email,
      values.userRole as IUserRole
    );
    console.log("existingUser  :::: ", existingUser);
    if (
      !existingUser ||
      !existingUser.userDetails ||
      !existingUser.userDetails.email ||
      !existingUser.userDetails.password
    )
      return { message: "Email does not exists!", status: false };
    // if (!existingUser.emailVerified) {
    //   const verificationToken = await generateVerificationTokenService(
    //     existingUser.email
    //   );
    //   return {
    //     message: "Confirm your email id, new confirmation mail was sent",
    //     status: false,
    //   };
    // }

    console.log("hit sign");

    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    console.log("res : ", res);
    console.log("hit success");

    return { message: "login successfull", status: true };
  } catch (error) {
    console.log("error: ", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid credentials", status: false };
          break;
        default:
          return { message: "Something went wrong", status: false };
          break;
      }
    }
    return { message: "Invalid credentials", status: false };
  }
};

export const getRefreshToken = async () => {
  const resp = await fetch(`${BASEURL}${SUBURLS.urls.refreshToken}`);
  const response = await resp.json();
  return response;
};

export const getUserByEmail = async (email: string, userRole: IUserRole) => {
  const body = JSON.stringify({ email, userRole });
  const resp = await fetch(`${BASEURL}${SUBURLS.urls.getUserByEmail}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
  return await resp.json();
};
