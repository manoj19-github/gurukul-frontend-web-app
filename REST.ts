import { getRefreshToken } from "./actions/auth.action";

let originalRequest: any;
export const OriginalFetch = async (...args: any) => {
  let [resource, config] = args;
  config.headers["Content-type"] = "application/json; charset=UTF-8";
  let response = await fetch(resource, config);

  // responce interceptor

  if (
    !response.ok &&
    (response?.status === 400 ||
      response.status === 404 ||
      response.status === 401)
  ) {
    originalRequest._retry = true;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fetch(resource, config);
  } else if (response?.status === 403 && !originalRequest?._retry) {
    originalRequest._retry = true;
    const response = await getRefreshToken();
    if (response.token?.accessToken) {
      config.headers["authorization"] = "Bearer" + response.token?.accessToken;
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await fetch(resource, config);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await fetch(resource, config);
  }
  return response;
};
