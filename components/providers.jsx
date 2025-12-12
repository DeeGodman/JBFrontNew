

"use client"
//I Added these imports myself
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, useEffect } from "react"
import { getCookie, setCookie } from "@/lib/utility/cookies";
import { appendResellerCode } from "@/lib/utility/appendReseller";


export function Providers({ children }) {
  const [queryClient] = useState(() =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          cacheTime: 60 * 60 * 1000, // 1 hour
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  )

//I AM ADDING USEEFFECT FOR PICKING RESELLERCODE FROM URL OR L/C/S over here

// useEffect(() => {
//   const url = new URL(window.location.href);
//   const newResellerCode = url.searchParams.get("resellerCode");


//    console.log("We are picking it up EveryWhere lol:", newResellerCode)
//   if (!newResellerCode) return;

//   const existingResellerCode = getCookie("resellerCode");

//   // If cookie doesn't exist → set it
//   if (!existingResellerCode) {
//     setCookie("resellerCode", newResellerCode, 30);
//     return;
//   }

//   // If cookie exists and is different → update it
//   if (existingResellerCode !== newResellerCode) {
//     setCookie("resellerCode", newResellerCode, 30);
//   }

//   // If cookie exists and is the same → do nothing
 


// }, []);




useEffect(() => {
  const DEFAULT_CODE = "adminResellerCode"; // your fallback value

  const url = new URL(window.location.href);
  const newCode = url.searchParams.get("resellerCode");

  const existingCode = localStorage.getItem("resellerCode");

  if (newCode) {
    // If URL has a code
    if (!existingCode || existingCode !== newCode) {
      localStorage.setItem("resellerCode", newCode);
    }
    return;
  }

  // If no URL code, ensure there's always a default stored
  if (!existingCode) {
    localStorage.setItem("resellerCode", DEFAULT_CODE);
  }
}, []);



  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
