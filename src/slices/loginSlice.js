import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { loginPost } from '../components/api/memberApi';
import { getCookie, removeCookie, setCookie } from '../util/cookieUtil'

const initState = { email: '' }
const loadMemberCookie = () => {
    const cookie = getCookie("member");
    if (cookie) {
        try {
            const memberInfo = JSON.parse(cookie); // Ensure JSON parsing
            if (memberInfo.nickname) {
                memberInfo.nickname = decodeURIComponent(memberInfo.nickname);
            }
            return memberInfo;
        } catch (err) {
            console.error("Error parsing member cookie:", err);
            removeCookie("member");
            return null; // Return null if parsing fails
        }
    }
    return null; // Default case if cookie doesn't exist
};


export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
    console.log("loginPostAsync call 200) ", param);
    return loginPost(param)
})

const loginSlice = createSlice({
    name: "LoginSlice",
    initialState: { ...initState, loading: false, error: null },
    reducers: {
        login: (state, action) => {
            console.log("LoginSlice-> login...");
            const data = action.payload;
            return { ...state, email: data.email }; // Maintain other states like `loading` and `error`
        },
        logout: (state, action) => {
            console.log("logout...");
            removeCookie("member");
            return { ...initState, loading: false, error: null }; // Reset state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginPostAsync.fulfilled, (state, action) => {
                console.log("fulfilled");
                const payload = action.payload;
                if (!payload.error) {
                    setCookie("member", JSON.stringify(payload), 1); // Store token in cookie
                    return { ...state, ...payload, loading: false, error: null }; // Update state
                } else {
                    return { ...state, loading: false, error: payload.error };
                }
            })
            .addCase(loginPostAsync.pending, (state) => {
                console.log("pending");
                return { ...state, loading: true, error: null };
            })
            .addCase(loginPostAsync.rejected, (state, action) => {
                console.log("rejected");
                return { ...state, loading: false, error: action.error.message || "Login failed" };
            });
    },
});

export const { login, logout } = loginSlice.actions

export default loginSlice.reducer