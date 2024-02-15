import { getRefreshToken } from "./actions/auth.action";
import Credentials from "next-auth/providers/credentials";

import type { NextAuthConfig } from "next-auth";

import Google from "next-auth/providers/google";
import { LoginSchema } from "./app/schema/auth.schema";
import { BASEURL, SUBURLS } from "./environments";
import setCookieFn from "./utils/setCookies";

export default {
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        console.log("credentials: ", credentials);
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password, userRole } = validatedFields.data;
          const body = JSON.stringify({ email, password, userRole });
          const response = await fetch(`${BASEURL}${SUBURLS.urls.login}`, {
            method: "POST",
            body,
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          });
          const user = await response.json();

          console.log("user:  cred", user);
          if (!!user && user?.data?.token) {
            setCookieFn(
              user.data.token.accessToken,
              user.data.token.refreshToken
            );
          }
          if (!user) return null;
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
