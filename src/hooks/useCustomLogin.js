import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useNavigate, Navigate } from "react-router-dom";
import { loginPostAsync, logout } from "../slices/loginSlice";
import { removeCookie } from "../util/cookieUtil";

const useCustomLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.loginSlice);
  console.log("loginState:", loginState);
  const isLogin = !!loginState.email;

  const doLogin = async (loginParam) => {
    console.log("doLogin params:", loginParam);

    const action = await dispatch(loginPostAsync(loginParam));
    console.log("Redux action returned:", action);

    if (action.payload && typeof action.payload === "object") {
      console.log("Parsed action.payload:", JSON.stringify(action.payload));
    } else {
      console.error("Invalid action.payload:", action.payload);
    }

    return action.payload;
  };

  const doLogout = () => {
    dispatch(logout());
    removeCookie("member");
  };

  const moveToPath = (path) => navigate(path, { replace: true });

  const moveToLogin = () => navigate("/member/login", { replace: true });

  const exceptionHandle = (error) => {
    const errorMsg = error?.response?.data?.error || "UNKNOWN_ERROR";
    if (errorMsg === "REQUIRE_LOGIN") {
      alert("You must log in.");
      moveToLogin();
    } else if (errorMsg === "ERROR_ACCESS_DENIED") {
      alert("You do not have permission.");
      moveToLogin();
    } else {
      console.error("Unhandled error:", errorMsg);
    }
  };

  return {
    isLogin,
    doLogin,
    doLogout,
    moveToPath,
    moveToLogin,
    exceptionHandle,
  };
};

export default useCustomLogin;
