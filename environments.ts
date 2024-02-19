/****
 * base url of Application Interface
 * @type {string}
 * *****/

import { Compass, Layout } from "lucide-react";

export const BASEURL = "http://localhost:5000/api/v1";

/***
 * sub url of Application Interface
 * @type {urls:{Record<string,string>}}
 *
 * ***/

export const SUBURLS = {
  urls: {
    registration: "/auth/registration",
    login: "/auth/login",
    socialLogin: "/auth/sociallogin",
    forgotPassword: "/auth/forgotpassword",
    resetPassword: "/auth/resetpassword",
    resetEmail: "/auth/resetemail",
    validateEmailRequest: "/auth/validateemailrequest",
    updateUserProfile: "/auth/updateuserprofile",
    logout: "/auth/logout",
    refreshToken: "/auth/refreshtoken",
    getLoggedInUser: "/auth/getloggedinuser",
    getUserByEmail: "/auth/getuserbyemail",
    verifyEmailForSocialLogin: "/auth/verifyemailforsociallogin",
  },
};

/***
 * An array of routes that are accessible to the public
 * these routes do not require authentication
 * @type {string[]}
 *
 * ***/

export const publicRoutes: string[] = [];

/****
 * An array of routes thatr are used for authenticationgit
 *@type {string[]}
 *
 * ****/

export const authRoutes = ["/login", "/sign-up", "/error"];
/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 *  **/
export const apiAuthPrefix = "/api/auth";
/***
 * Ther default redirect path after user logged in
 * @type {string}
 * ***/
export const DEFAULT_LOGIN_REDIRECT = "/settings";

export const guestRoutes = [
  {
    icon: Layout,
    label: "Dasboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];