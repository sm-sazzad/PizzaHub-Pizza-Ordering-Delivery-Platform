// import { headers } from "next/headers";
// import { auth } from "./auth";
import { token } from "./auth-client";

// 1. Get JWT token on the server side
// export const getTokenServer = async () => {
//   try {
//     const getToken = await auth.api.getToken({
//       headers: await headers(),
//     });
//     return getToken?.token || null;
//   } catch (error) {
//     console.error("Failed to get server token:", error);
//     return null;
//   }
// };

// 2. Get JWT token on the client side
export const getTokenClient = async () => {
  try {
    const { data } = await token();
    if (data?.token) {
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to get client token:", error);
    return null;
  }
};
