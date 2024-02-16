// import { auth } from "./auth";
import { authMiddleware } from "@clerk/nextjs";
import { publicRoutes } from "./environments";

export default authMiddleware({
  publicRoutes: [...publicRoutes],
});
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
