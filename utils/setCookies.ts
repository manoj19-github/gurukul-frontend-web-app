import { ITokenOptions } from "@/interfaces/user.interface";
import { setCookie } from "cookies-next";
import moment from "moment";
import { cookies } from "next/headers";
const setCookieFn = (accessToken: string, refreshToken: string) => {
  console.log("accessToken: ", accessToken);
  const accessTokenExpiresIn: any =
    process.env.JWT_ACCESS_TOKEN_EXPIRES || "5m";
  const refreshTokenExpiresIn: any =
    process.env.JWT_REFRESH_TOKEN_EXPIRES || "31d";
  const accessTimeDays = String(accessTokenExpiresIn)
    .split("")
    .filter((self) => Number.isInteger(Number(self)))
    .join("");
  const refreshTimeDays = String(refreshTokenExpiresIn)
    .split("")
    .filter((self) => Number.isInteger(Number(self)))
    .join("");
  const accessTokenExpiresDate = new Date(
    moment().add(accessTimeDays, "minutes").format("YYYY-MM-DD HH:mm:ss")
  );
  const refreshTokenExpiresDate = new Date(
    moment().add(refreshTimeDays, "days").format("YYYY-MM-DD")
  );

  const accessTokenOptions: ITokenOptions = {
    expires: accessTokenExpiresDate,
    maxAge: accessTokenExpiresDate.getTime(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
  const refreshTokenOptions: ITokenOptions = {
    expires: refreshTokenExpiresDate,
    maxAge: refreshTokenExpiresDate.getTime(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  console.log("accessTokenOptions ", accessTokenOptions);

  cookies().set("gurukul_access_token", accessToken, accessTokenOptions);
  cookies().set("gurukul_refresh_token", refreshToken, refreshTokenOptions);
};

export default setCookieFn;
