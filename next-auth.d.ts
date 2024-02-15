import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { IUserRole } from "./interfaces/user.interface";
export type ExtendedUser = DefaultSession["user"] & {
  role: IUserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
  interface User {
    role?: IUserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: IUserRole;
    user?: any;
  }
}
