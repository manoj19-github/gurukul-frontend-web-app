import NextAuth, { type DefaultSession } from "next-auth";
import Github from "next-auth/providers/github";
import authConfig from "./auth.config";
import { BASEURL, SUBURLS } from "./environments";
import { IUserRole } from "./interfaces/user.interface";
import { cookies } from "next/headers";
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      const body = JSON.stringify({ email: user.email });
      const res = await fetch(
        `${BASEURL}${SUBURLS.urls.verifyEmailForSocialLogin}`,
        { method: "POST", body }
      );
      await res.json();
    },
  },
  callbacks: {
    /***
     * if user is not email verified then they can't  login
     *  ****/
    async signIn({ user, account, profile }) {
      const body = JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.image,
        userRole: "STUDENT",
        password: user.id,
      });
      const registeredUser = await fetch(
        `${BASEURL}${SUBURLS.urls.socialLogin}`,
        { method: "POST", body }
      );
      await registeredUser.json();
      return true;
    },
    async session({ token, session }) {
      console.log("session dataset token : ", token);
      console.log("session dataset session : ", session);
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as IUserRole;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      console.log("token in jwt : ", token, user);
      token.accessToken = user?.data?.token?.accessToken;
      token.refreshyToken = user?.data?.token?.refreshToken;
      token.user = user?.data?.user;
      return token;
    },
  },
  // adapter: PrismaAdapter(dbConfig),
  session: { strategy: "jwt" },
  ...authConfig,
});
