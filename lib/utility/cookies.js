

//This function sets cookies in the browser
// export function setCookie(name, value, days = 30) {
//   const maxAge = days * 24 * 60 * 60;
//   document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
// }


export function setCookie(name, value, days = 30) {
  const maxAge = days * 24 * 60 * 60;
  
  // Build cookie string with security options
  const cookieOptions = [
    `${name}=${value}`,
    'path=/',
    `max-age=${maxAge}`,
    'secure', // Only over HTTPS (will fail on localhost HTTP)
    'sameSite=Lax' // or 'None' if cross-domain
  ];
  
  document.cookie = cookieOptions.join('; ');
}


//This Function gets cookies from the browser
export function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="));

  return cookie ? cookie.split("=")[1] : null;
}

//This function deletes cookies from the browser
export function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
