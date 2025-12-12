// /lib/appendReseller.js

import { getCookie } from "./cookies";

export function appendResellerCode(url) {
  const resellerCode = getCookie("resellerCode");

  if (!resellerCode) return url; // nothing to append

  const newUrl = new URL(url, window.location.origin);
  newUrl.searchParams.set("resellerCode", resellerCode);

  return newUrl.toString();
}
