import { Cookies } from "react-cookie";

const cookies = new Cookies()

export const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    // console.log(`[setCookie] Cookie set: ${name}=${value}`);
    // console.log(`[setCookie] Current Cookies: ${document.cookie}`);
};

export const getCookie = (name) => {
    console.log("[getCookie] Fetching cookie:", name);
    const cookieString = document.cookie;
    // console.log("[getCookie] Current Cookies:", cookieString);
    const cookies = cookieString.split('; ');
    for (let cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name) {
            // console.log(`[getCookie] Cookie found: ${name}=${val}`);
            return decodeURIComponent(val);
        }
    }
    console.warn(`[getCookie] Cookie not found: ${name}`);
    return null;
};



export const removeCookie = (name, path = "/") => {
    cookies.remove(name, { path })
}