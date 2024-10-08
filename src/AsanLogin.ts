import axios from "axios";
import store from "store";
import JWT from "jwt-decode";
import { useLocation } from "react-router-dom";
import {
  authenticateUserSuccess,
  logoutUser,
  setAuthLoading,
} from "store/auth/actions";
import { getCookie } from "utils/cookies";
import {
  getRedirectOrigin,
  setRedirectOrigin,
  removeRedirectOrigin,
} from "utils/sessionStorage";
import { isDevelopment } from "utils/getEnvironment";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const logout = Boolean(urlParams.get("logout"));
const admin = Boolean(urlParams.get("admin"));
const asanLoginBaseUrl = isDevelopment
  ? "https://portal.login.gov.az"
  : "https://digital.login.gov.az";

const axiosAsanLoginInstance = axios.create({
  baseURL: asanLoginBaseUrl,
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: isDevelopment
    ? process.env.REACT_APP_BASE_URL_DEV
    : process.env.REACT_APP_BASE_URL,
  responseType: "json",
  headers: {
    "Content-type": "application/json",
    "Accept-Language": "az",
  },
});

const AsanLogin = async (auth_code) => {
  // Access specific query parameters

  let redirectOrigin: string | null = window.document.referrer;

  const href = window.location.href;
  const notRedirect =
    href === `${origin}/executive` || href === `${origin}/report` || !admin;
  const reportOrigin = "https://map-report.asanmuraciet.gov.az/";
  const executiveOrigin = "https://icra.asanmuraciet.gov.az/";
  const willRedirect =
    (redirectOrigin === reportOrigin || redirectOrigin === executiveOrigin) &&
    !notRedirect;

  const ASAN_Appeal_Access_Token = getCookie("ASAN-APPEAL-TOKEN");

  if ((logout && willRedirect) || logout) store.dispatch(logoutUser());
  else if (willRedirect && ASAN_Appeal_Access_Token)
    window.location.href = redirectOrigin;
  else if (!willRedirect && ASAN_Appeal_Access_Token)
    store.dispatch(authenticateUserSuccess());
  else {
    if (!getRedirectOrigin() && willRedirect) setRedirectOrigin(redirectOrigin);
    else if (getRedirectOrigin()) redirectOrigin = getRedirectOrigin();
    else {
      removeRedirectOrigin();
      redirectOrigin = null;
    }

    store.dispatch(setAuthLoading(true));
    try {
      /*    const resAsanLogin = await axiosAsanLoginInstance.get(
        "/ssoauth/oauth2/token"
      ); */
      /*   const { data } = resAsanLogin.data; */
      /*  const { token: asanLoginToken } = data; */

      const res = await axiosInstance.post(
        isDevelopment ? "/auth/AsanLoginV2" : "/auth/AsanLogin",
        {
          code: auth_code,
        }
      );
      const { data: accessToken } = res.data;
      const decoded: any = JWT(accessToken);
      const expDate = new Date(decoded.exp * 1000).toUTCString();

      if (isDevelopment)
        document.cookie = `ASAN-APPEAL-TOKEN=${accessToken}; expires=${expDate}; domain=.asan.org; path=/`;
      else
        document.cookie = `ASAN-APPEAL-TOKEN=${accessToken}; expires=${expDate}; domain=.asanmuraciet.gov.az; path=/`;

      if (redirectOrigin) window.location.href = redirectOrigin;
      else store.dispatch(authenticateUserSuccess());
    } catch (err) {
      console.log(err);
    }

    store.dispatch(setAuthLoading(false));
  }
};

export default AsanLogin;
