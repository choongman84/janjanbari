import axios from "axios";
import { getCookie, removeCookie, setCookie } from "./cookieUtil";

// Base URL for API
const baseURL = "http://localhost:8080";
console.log("API Base URL:", baseURL);

// Create Axios instance
const jwtAxios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Public API paths that do not require authentication
const publicPaths = [
  "/api/members/login",
  "/api/members/signup",
  "/api/kits",
  "/api/kits/",
  "/images/",
];

// Function to check if a request is public
const isPublicPath = (url) => publicPaths.some((path) => url.includes(path));

// Request Interceptor
jwtAxios.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);

    const memberInfo = getCookie("member");
    console.log("Request Interceptor - memberInfo:", memberInfo);

    // Skip adding Authorization for public APIs
    if (isPublicPath(config.url)) {
      console.log("Public path, skipping Authorization header");
      return config;
    }

    // Handle protected routes
    if (memberInfo) {
      try {
        const parsedMemberInfo = JSON.parse(memberInfo);
        if (parsedMemberInfo?.accessToken) {
          config.headers.Authorization = `Bearer ${parsedMemberInfo.accessToken}`;
          console.log("Added Authorization header:", config.headers.Authorization);
        }
      } catch (error) {
        console.error("Error parsing memberInfo:", error);
        removeCookie("member");
        return Promise.reject({
          response: { data: { error: "INVALID_MEMBER_INFO" } },
        });
      }
    } else {
      console.warn("No member info found, redirecting to login");
      return Promise.reject({
        response: { data: { error: "REQUIRE_LOGIN" } },
      });
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
jwtAxios.interceptors.response.use(
  (response) => {
    console.log("Response Success:", response.config.url);
    return response;
  },
  async (error) => {
    console.error("Response Error:", error.config?.url, error.response?.status);

    // Handle 401 Unauthorized or 403 Forbidden
    if (error.response?.status === 401 || error.response?.status === 403) {
      const memberInfo = getCookie("member");

      if (!memberInfo) {
        console.warn("No member info, redirecting to login");
        window.location.href = "/members/login";
        return Promise.reject(error);
      }

      try {
        const parsedMemberInfo = JSON.parse(memberInfo);

        // Attempt to refresh the token
        console.log("Attempting to refresh token...");
        const response = await jwtAxios.post(
          `${baseURL}/api/members/refresh`,
          null,
          {
            headers: {
              Authorization: `Bearer ${parsedMemberInfo.accessToken}`,
              "Refresh-Token": parsedMemberInfo.refreshToken,
            },
          }
        );

        if (response.data.accessToken) {
          console.log("Token refreshed successfully");

          // Update the cookie with the new access token
          parsedMemberInfo.accessToken = response.data.accessToken;
          setCookie("member", JSON.stringify(parsedMemberInfo), 1);

          // Retry the original request with the new token
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return jwtAxios(error.config);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.response?.data || refreshError.message);
        removeCookie("member");
        window.location.href = "/members/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default jwtAxios;
